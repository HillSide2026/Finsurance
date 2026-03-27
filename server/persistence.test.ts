import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createEmptyStrIntake } from "@shared/str";
import { PersistentAppStore } from "./persistence";

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
