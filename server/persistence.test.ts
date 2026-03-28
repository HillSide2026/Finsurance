import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createEmptyStrIntake } from "@shared/str";
import { DraftConflictError, PersistentAppStore } from "./persistence";

async function createTempStore() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "finsurance-store-"));
  const filePath = path.join(tempDir, "app-store.json");
  const store = new PersistentAppStore(filePath);

  return {
    filePath,
    store,
    async cleanup() {
      await rm(tempDir, { recursive: true, force: true });
    },
  };
}

test("persistent store registers users, manages sessions, and reloads from disk", async (t) => {
  const { filePath, store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const summary = await store.registerOwnerAccount({
    teamName: "Levine Compliance",
    name: "Operator One",
    email: "operator@example.com",
    password: "Password123",
  });

  assert.equal(summary.team.name, "Levine Compliance");
  assert.equal(summary.user.role, "owner");

  const authenticated = await store.authenticateUser("operator@example.com", "Password123");
  assert.equal(authenticated?.user.email, "operator@example.com");

  const createdSession = await store.createAuthSession(summary, {
    ipAddress: "127.0.0.1",
    userAgent: "node-test",
  });
  const loadedSession = await store.getSessionByToken(createdSession.token);
  assert.equal(loadedSession?.team.id, summary.team.id);

  const reloadedStore = new PersistentAppStore(filePath);
  const reloadedSession = await reloadedStore.getSessionByToken(createdSession.token);
  assert.equal(reloadedSession?.user.id, summary.user.id);

  await reloadedStore.revokeSession(createdSession.token, "127.0.0.1");
  const postRevokeStore = new PersistentAppStore(filePath);
  const revokedSession = await postRevokeStore.getSessionByToken(createdSession.token);
  assert.equal(revokedSession, null);
});

test("persistent store saves drafts, lists them, reopens them, and records exports", async (t) => {
  const { store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const summary = await store.registerOwnerAccount({
    teamName: "North River Pay",
    name: "Reviewer One",
    email: "reviewer@example.com",
    password: "Password123",
  });

  const intake = createEmptyStrIntake();
  intake.customerData.name = "North River Holdings";
  intake.triggerTypes = ["structuring"];
  intake.amountBand = "10k_to_50k";
  intake.currency = "CAD";
  intake.transactionCount = "4_to_10";
  intake.timeframe = "2_to_7_days";
  intake.transactionChannels = ["cash"];
  intake.clientRelationship = "new";
  intake.customerType = "individual";
  intake.jurisdictions = ["canada"];
  intake.suspicionIndicators = ["avoidance_tactics"];

  const draft = await store.saveDraft(summary.team.id, summary.user.id, {
    title: "North River review",
    status: "draft",
    assignedReviewerUserId: summary.user.id,
    lastWorkflowView: "review",
    sessionMeta: {
      id: "STR-TEST-001",
      timestamp: new Date("2026-03-26T12:00:00.000Z").toISOString(),
    },
    intake,
    narrativeText: "Draft narrative text",
  }, "127.0.0.1");

  assert.match(draft.id, /^draft_/);
  assert.equal(draft.title, "North River review");
  assert.equal(draft.assignedReviewerUserId, summary.user.id);
  assert.equal(draft.readinessStatus, "ready_to_draft");

  const drafts = await store.listTeamDrafts(summary.team.id);
  assert.equal(drafts.length, 1);
  assert.equal(drafts[0]?.title, "North River review");
  assert.equal(drafts[0]?.assignedReviewerName, "Reviewer One");

  const openedDraft = await store.getDraftForTeam(
    draft.id,
    summary.team.id,
    summary.user.id,
    "127.0.0.1",
  );
  assert.equal(openedDraft?.narrativeText, "Draft narrative text");
  assert.ok(openedDraft?.lastOpenedAt);

  const exportedDraft = await store.recordDraftExport(
    summary.team.id,
    summary.user.id,
    draft.id,
    "package",
    "127.0.0.1",
  );
  assert.ok(exportedDraft?.lastExportedAt);
  assert.equal(exportedDraft?.updatedAt, draft.updatedAt);
});

test("persistent store rejects stale draft saves to avoid silent overwrites", async (t) => {
  const { store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const summary = await store.registerOwnerAccount({
    teamName: "Conflict Team",
    name: "Conflict Owner",
    email: "conflict.owner@example.com",
    password: "Password123",
  });

  const intake = createEmptyStrIntake();
  intake.triggerTypes = ["structuring"];
  intake.amountBand = "10k_to_50k";
  intake.currency = "CAD";
  intake.transactionCount = "4_to_10";
  intake.timeframe = "2_to_7_days";
  intake.transactionChannels = ["cash"];
  intake.clientRelationship = "new";
  intake.customerType = "individual";
  intake.jurisdictions = ["canada"];
  intake.suspicionIndicators = ["avoidance_tactics"];

  const draft = await store.saveDraft(
    summary.team.id,
    summary.user.id,
    {
      title: "Conflict test",
      status: "draft",
      assignedReviewerUserId: null,
      lastWorkflowView: "review",
      sessionMeta: {
        id: "STR-CONFLICT-001",
        timestamp: new Date("2026-03-27T12:00:00.000Z").toISOString(),
      },
      intake,
      narrativeText: "Initial draft narrative",
    },
    "127.0.0.1",
  );

  const savedAgain = await store.saveDraft(
    summary.team.id,
    summary.user.id,
    {
      draftId: draft.id,
      expectedUpdatedAt: draft.updatedAt,
      title: "Conflict test",
      status: "draft",
      assignedReviewerUserId: null,
      lastWorkflowView: "narrative",
      sessionMeta: draft.sessionMeta,
      intake,
      narrativeText: "Updated narrative",
    },
    "127.0.0.1",
  );

  await assert.rejects(
    () =>
      store.saveDraft(
        summary.team.id,
        summary.user.id,
        {
          draftId: draft.id,
          expectedUpdatedAt: draft.updatedAt,
          title: "Conflict test",
          status: "draft",
          assignedReviewerUserId: null,
          lastWorkflowView: "output",
          sessionMeta: draft.sessionMeta,
          intake,
          narrativeText: "Stale overwrite attempt",
        },
        "127.0.0.1",
      ),
    (error: unknown) =>
      error instanceof DraftConflictError &&
      error.message.includes("changed since your last saved version"),
  );

  const reopenedDraft = await store.getDraftForTeam(
    draft.id,
    summary.team.id,
    summary.user.id,
    "127.0.0.1",
  );
  assert.equal(reopenedDraft?.narrativeText, savedAgain.narrativeText);
  assert.equal(reopenedDraft?.lastWorkflowView, savedAgain.lastWorkflowView);
});

test("persistent store keeps draft retrieval stable across repeated saves and restart", async (t) => {
  const { filePath, store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const summary = await store.registerOwnerAccount({
    teamName: "Repeat Save Team",
    name: "Repeat Saver",
    email: "repeat.saver@example.com",
    password: "Password123",
  });

  const intake = createEmptyStrIntake();
  intake.triggerTypes = ["structuring"];
  intake.amountBand = "10k_to_50k";
  intake.currency = "CAD";
  intake.transactionCount = "4_to_10";
  intake.timeframe = "2_to_7_days";
  intake.transactionChannels = ["cash"];
  intake.clientRelationship = "new";
  intake.customerType = "individual";
  intake.jurisdictions = ["canada"];
  intake.suspicionIndicators = ["avoidance_tactics"];

  let draft = await store.saveDraft(
    summary.team.id,
    summary.user.id,
    {
      title: "Repeated save test",
      status: "draft",
      assignedReviewerUserId: null,
      lastWorkflowView: "review",
      sessionMeta: {
        id: "STR-REPEAT-001",
        timestamp: new Date("2026-03-27T12:30:00.000Z").toISOString(),
      },
      intake,
      narrativeText: "Revision 0",
    },
    "127.0.0.1",
  );

  for (let index = 1; index <= 10; index += 1) {
    draft = await store.saveDraft(
      summary.team.id,
      summary.user.id,
      {
        draftId: draft.id,
        expectedUpdatedAt: draft.updatedAt,
        title: "Repeated save test",
        status: "draft",
        assignedReviewerUserId: null,
        lastWorkflowView: index % 2 === 0 ? "narrative" : "review",
        sessionMeta: draft.sessionMeta,
        intake,
        narrativeText: `Revision ${index}`,
      },
      "127.0.0.1",
    );
  }

  const reloadedStore = new PersistentAppStore(filePath);
  const reopenedDraft = await reloadedStore.getDraftForTeam(
    draft.id,
    summary.team.id,
    summary.user.id,
    "127.0.0.1",
  );

  assert.equal(reopenedDraft?.narrativeText, "Revision 10");
  assert.equal(reopenedDraft?.title, "Repeated save test");
});

test("persistent store records public enquiries", async (t) => {
  const { store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const enquiryId = await store.createProductEnquiry(
    {
      name: "Jordan Lee",
      email: "jordan@example.com",
      company: "North River Pay",
      sourcePath: "/finsure",
    },
    "127.0.0.1",
  );

  assert.match(enquiryId, /^enquiry_/);
});

test("persistent store records Stripe webhook events idempotently", async (t) => {
  const { store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const firstRecord = await store.recordStripeWebhookEvent(
    {
      eventId: "evt_test_123",
      eventType: "checkout.session.completed",
      objectId: "cs_test_123",
      livemode: false,
      apiVersion: "2025-03-31.basil",
      account: null,
      payload: '{"id":"evt_test_123"}',
    },
    "127.0.0.1",
  );
  assert.equal(firstRecord.duplicate, false);

  const duplicateRecord = await store.recordStripeWebhookEvent(
    {
      eventId: "evt_test_123",
      eventType: "checkout.session.completed",
      objectId: "cs_test_123",
      livemode: false,
      apiVersion: "2025-03-31.basil",
      account: null,
      payload: '{"id":"evt_test_123"}',
    },
    "127.0.0.1",
  );
  assert.equal(duplicateRecord.duplicate, true);
});

test("persistent store records and updates Stripe checkout sessions", async (t) => {
  const { filePath, store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const summary = await store.registerOwnerAccount({
    teamName: "FinSure Ops",
    name: "Billing Owner",
    email: "billing.owner@example.com",
    password: "Password123",
  });

  const exportDraft = await store.saveDraft(
    summary.team.id,
    summary.user.id,
    {
      title: "Export access test",
      status: "draft",
      assignedReviewerUserId: null,
      lastWorkflowView: "output",
      sessionMeta: {
        id: "STR-BILLING-001",
        timestamp: new Date("2026-03-27T12:00:00.000Z").toISOString(),
      },
      intake: createEmptyStrIntake(),
      narrativeText: "Billing draft narrative",
    },
    "127.0.0.1",
  );

  const createdRecord = await store.recordBillingCheckoutSession(
    {
      sessionId: "cs_test_456",
      checkoutUrl: "https://checkout.stripe.com/c/pay/cs_test_456",
      sourcePath: "/finsure",
      draftId: exportDraft.id,
      teamId: summary.team.id,
      userId: summary.user.id,
      customerEmail: summary.user.email,
      clientReferenceId: `team:${summary.team.id}:user:${summary.user.id}`,
      status: "open",
      paymentStatus: "unpaid",
      amountTotal: 4900,
      currency: "CAD",
      livemode: false,
    },
    "127.0.0.1",
  );
  assert.equal(createdRecord.created, true);

  const updatedRecord = await store.recordBillingCheckoutSession(
    {
      sessionId: "cs_test_456",
      checkoutUrl: null,
      sourcePath: "/finsure",
      draftId: exportDraft.id,
      teamId: null,
      userId: null,
      customerEmail: "billing.owner@example.com",
      clientReferenceId: null,
      status: "complete",
      paymentStatus: "paid",
      amountTotal: 4900,
      currency: "CAD",
      livemode: false,
    },
    "127.0.0.1",
  );
  assert.equal(updatedRecord.created, false);

  const persisted = JSON.parse(await readFile(filePath, "utf8")) as {
    billingCheckoutSessions?: Array<{
      id: string;
      draftId: string | null;
      teamId: string | null;
      userId: string | null;
      status: string | null;
      paymentStatus: string | null;
      completedAt: string | null;
      customerEmail: string | null;
    }>;
  };

  const sessionRecord = persisted.billingCheckoutSessions?.find(
    (candidate) => candidate.id === "cs_test_456",
  );
  assert.equal(sessionRecord?.draftId, exportDraft.id);
  assert.equal(sessionRecord?.teamId, summary.team.id);
  assert.equal(sessionRecord?.userId, summary.user.id);
  assert.equal(sessionRecord?.status, "complete");
  assert.equal(sessionRecord?.paymentStatus, "paid");
  assert.equal(sessionRecord?.customerEmail, "billing.owner@example.com");
  assert.ok(sessionRecord?.completedAt);

  const exportAccess = await store.getDraftExportAccess(summary.team.id, exportDraft.id);
  assert.equal(exportAccess.unlocked, true);
  assert.equal(exportAccess.paidCheckoutSessionId, "cs_test_456");
});

test("persistent store summarizes product funnel milestones without double-counting flows", async (t) => {
  const { filePath, store, cleanup } = await createTempStore();
  t.after(async () => {
    await cleanup();
  });

  const sourcePath = "/finsure";
  const flowStartedOnly = "STR-FLOW-001";
  const flowCompletedOnly = "STR-FLOW-002";
  const flowPaid = "STR-FLOW-003";

  const firstStart = await store.recordProductFunnelEvent(
    {
      eventType: "str_started",
      flowId: flowStartedOnly,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );
  assert.equal(firstStart.created, true);

  const duplicateStart = await store.recordProductFunnelEvent(
    {
      eventType: "str_started",
      flowId: flowStartedOnly,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );
  assert.equal(duplicateStart.created, false);

  await store.recordProductFunnelEvent(
    {
      eventType: "str_started",
      flowId: flowCompletedOnly,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );
  await store.recordProductFunnelEvent(
    {
      eventType: "str_completed",
      flowId: flowCompletedOnly,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );

  await store.recordProductFunnelEvent(
    {
      eventType: "str_started",
      flowId: flowPaid,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );
  await store.recordProductFunnelEvent(
    {
      eventType: "str_completed",
      flowId: flowPaid,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );
  await store.recordProductFunnelEvent(
    {
      eventType: "export_initiated",
      flowId: flowPaid,
      sourcePath,
      draftId: null,
      teamId: null,
      userId: null,
    },
    "127.0.0.1",
  );

  const summary = await store.registerOwnerAccount({
    teamName: "Observability Team",
    name: "Observability Owner",
    email: "observability.owner@example.com",
    password: "Password123",
  });

  const paidDraft = await store.saveDraft(
    summary.team.id,
    summary.user.id,
    {
      title: "Tracked paid flow",
      status: "draft",
      assignedReviewerUserId: null,
      lastWorkflowView: "output",
      sessionMeta: {
        id: flowPaid,
        timestamp: new Date("2026-03-27T13:00:00.000Z").toISOString(),
      },
      intake: createEmptyStrIntake(),
      narrativeText: "Tracked payment narrative",
    },
    "127.0.0.1",
  );

  await store.recordBillingCheckoutSession(
    {
      sessionId: "cs_funnel_123",
      checkoutUrl: "https://checkout.stripe.com/c/pay/cs_funnel_123",
      sourcePath,
      draftId: paidDraft.id,
      teamId: summary.team.id,
      userId: summary.user.id,
      customerEmail: summary.user.email,
      clientReferenceId: `team:${summary.team.id}:user:${summary.user.id}:draft:${paidDraft.id}`,
      status: "complete",
      paymentStatus: "paid",
      amountTotal: 900,
      currency: "CAD",
      livemode: false,
    },
    "127.0.0.1",
  );

  const funnel = await store.getProductFunnelSummary();
  assert.deepEqual(funnel.counts, {
    strStarted: 3,
    strCompleted: 2,
    exportInitiated: 1,
    paymentCompleted: 1,
  });
  assert.deepEqual(funnel.dropOffs, {
    startedWithoutCompletion: 1,
    completedWithoutExportInitiated: 1,
    exportInitiatedWithoutPayment: 0,
  });
  assert.equal(funnel.rates.completionFromStarted, 66.7);
  assert.equal(funnel.rates.reachExportFromStarted, 33.3);
  assert.equal(funnel.rates.paymentFromExportInitiated, 100);
  assert.equal(funnel.rates.paymentFromStarted, 33.3);
  assert.ok(funnel.lastEventAt);

  const persisted = JSON.parse(await readFile(filePath, "utf8")) as {
    productFunnelEvents?: Array<{
      eventType: string;
      flowId: string;
      draftId: string | null;
      teamId: string | null;
    }>;
  };

  const paidStartEvent = persisted.productFunnelEvents?.find(
    (event) => event.eventType === "str_started" && event.flowId === flowPaid,
  );
  assert.equal(paidStartEvent?.draftId, paidDraft.id);
  assert.equal(paidStartEvent?.teamId, summary.team.id);

  const paymentCompletedEvent = persisted.productFunnelEvents?.find(
    (event) => event.eventType === "payment_completed" && event.flowId === flowPaid,
  );
  assert.equal(paymentCompletedEvent?.draftId, paidDraft.id);
  assert.equal(paymentCompletedEvent?.teamId, summary.team.id);
});
