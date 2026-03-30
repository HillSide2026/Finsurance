import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  productFunnelEventTypeValues,
  type ProductFunnelEventType,
  type ProductFunnelSummary,
} from "@shared/analytics";
import { buildStrDraft, normalizeStrIntake, type StrIntake } from "@shared/str";
import type {
  AuthSessionSummary,
  DraftDetailResponse,
  DraftRecord,
  DraftSummary,
  DraftStatus,
  ProductEnquiryRequest,
  SaveDraftRequest,
  TeamSummary,
  UserSummary,
  WorkflowStepView,
} from "@shared/workspace";

type InternalTeamRecord = TeamSummary & {
  createdAt: string;
  updatedAt: string;
};

type InternalUserRecord = UserSummary & {
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
};

type InternalAuthSessionRecord = {
  id: string;
  teamId: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
  userAgent: string;
  ipAddress: string;
};

type InternalDraftExportRecord = {
  id: string;
  teamId: string;
  draftId: string;
  exportedByUserId: string;
  format: "narrative" | "package";
  createdAt: string;
};

type InternalProductEnquiryRecord = ProductEnquiryRequest & {
  id: string;
  createdAt: string;
  status: "new";
};

type InternalStripeWebhookEventRecord = {
  id: string;
  type: string;
  objectId: string | null;
  livemode: boolean;
  apiVersion: string | null;
  account: string | null;
  receivedAt: string;
  payloadHash: string;
};

type InternalBillingCheckoutSessionRecord = {
  id: string;
  checkoutUrl: string | null;
  sourcePath: string;
  draftId: string | null;
  teamId: string | null;
  userId: string | null;
  customerEmail: string | null;
  clientReferenceId: string | null;
  status: string | null;
  paymentStatus: string | null;
  amountTotal: number | null;
  currency: string | null;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

type InternalAuditEventRecord = {
  id: string;
  teamId: string | null;
  actorUserId: string | null;
  entityType: "auth" | "draft" | "enquiry" | "billing" | "product";
  entityId: string;
  action: string;
  createdAt: string;
  ipAddress: string;
  metadata: Record<string, string>;
};

type InternalProductFunnelEventRecord = {
  id: string;
  flowId: string;
  eventType: ProductFunnelEventType;
  sourcePath: string;
  draftId: string | null;
  teamId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

type AppStoreData = {
  teams: InternalTeamRecord[];
  users: InternalUserRecord[];
  authSessions: InternalAuthSessionRecord[];
  drafts: DraftRecord[];
  draftExports: InternalDraftExportRecord[];
  enquiries: InternalProductEnquiryRecord[];
  stripeWebhookEvents: InternalStripeWebhookEventRecord[];
  billingCheckoutSessions: InternalBillingCheckoutSessionRecord[];
  productFunnelEvents: InternalProductFunnelEventRecord[];
  auditEvents: InternalAuditEventRecord[];
};

type CreateOwnerAccountInput = {
  teamName: string;
  name: string;
  email: string;
  password: string;
};

type SessionContext = {
  userAgent: string;
  ipAddress: string;
};

const sessionDurationMs = 1000 * 60 * 60 * 24 * 30;
const scryptKeyLength = 64;

export class DraftConflictError extends Error {
  readonly code = "draft_conflict";

  constructor(message: string) {
    super(message);
    this.name = "DraftConflictError";
  }
}

function createEmptyStore(): AppStoreData {
  return {
    teams: [],
    users: [],
    authSessions: [],
    drafts: [],
    draftExports: [],
    enquiries: [],
    stripeWebhookEvents: [],
    billingCheckoutSessions: [],
    productFunnelEvents: [],
    auditEvents: [],
  };
}

function hydrateStoreData(value: unknown): AppStoreData {
  const parsed = value as Partial<AppStoreData> | null;

  return {
    teams: Array.isArray(parsed?.teams) ? parsed.teams : [],
    users: Array.isArray(parsed?.users) ? parsed.users : [],
    authSessions: Array.isArray(parsed?.authSessions) ? parsed.authSessions : [],
    drafts: Array.isArray(parsed?.drafts) ? parsed.drafts : [],
    draftExports: Array.isArray(parsed?.draftExports) ? parsed.draftExports : [],
    enquiries: Array.isArray(parsed?.enquiries) ? parsed.enquiries : [],
    stripeWebhookEvents: Array.isArray(parsed?.stripeWebhookEvents)
      ? parsed.stripeWebhookEvents
      : [],
    billingCheckoutSessions: Array.isArray(parsed?.billingCheckoutSessions)
      ? parsed.billingCheckoutSessions
      : [],
    productFunnelEvents: Array.isArray(parsed?.productFunnelEvents)
      ? parsed.productFunnelEvents
      : [],
    auditEvents: Array.isArray(parsed?.auditEvents) ? parsed.auditEvents : [],
  };
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeEmail(value: string): string {
  return normalizeText(value).toLowerCase();
}

function slugify(value: string): string {
  const slug = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "team";
}

function makeId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

function deriveDraftTitle(input: { title: string; intake: StrIntake; sessionId: string }): string {
  const normalizedTitle = normalizeText(input.title);
  if (normalizedTitle.length > 0) {
    return normalizedTitle;
  }

  const customerName = normalizeText(input.intake.customerData.name);
  if (customerName.length > 0) {
    return `${customerName} STR draft`;
  }

  if (input.intake.scenarioPresetId) {
    return `${input.intake.scenarioPresetId.replace(/-/g, " ")} draft`;
  }

  return `STR draft ${input.sessionId}`;
}

function hashSecret(secret: string, salt: string): string {
  return crypto.scryptSync(secret, salt, scryptKeyLength).toString("hex");
}

function timingSafeMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sanitizeUser(user: InternalUserRecord): UserSummary {
  return {
    id: user.id,
    teamId: user.teamId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function sanitizeTeam(team: InternalTeamRecord): TeamSummary {
  return {
    id: team.id,
    name: team.name,
    slug: team.slug,
  };
}

function ensureDraftStatus(value: string): DraftStatus {
  switch (value) {
    case "draft":
    case "in_review":
    case "ready_for_filing":
    case "archived":
      return value;
    default:
      return "draft";
  }
}

function ensureWorkflowStepView(value: string): WorkflowStepView {
  switch (value) {
    case "intake":
    case "review":
    case "narrative":
    case "output":
      return value;
    default:
      return "intake";
  }
}

function isProductFunnelEventType(value: string): value is ProductFunnelEventType {
  return productFunnelEventTypeValues.includes(value as ProductFunnelEventType);
}

function normalizeSourcePath(value: string | null | undefined): string {
  const normalized = normalizeText(value ?? "");
  return normalized.startsWith("/") ? normalized : "/finsure";
}

function formatPercentage(numerator: number, denominator: number): number | null {
  if (denominator === 0) {
    return null;
  }

  return Number(((numerator / denominator) * 100).toFixed(1));
}

export function resolveAppDataFilePath(env: NodeJS.ProcessEnv = process.env): string {
  const configuredPath = normalizeText(env.APP_DATA_PATH ?? "");
  return configuredPath.length > 0
    ? configuredPath
    : path.resolve(process.cwd(), "data", "app-store.json");
}

export class PersistentAppStore {
  private readonly filePath: string;
  private cache: AppStoreData | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(filePath = resolveAppDataFilePath()) {
    this.filePath = filePath;
  }

  private async ensureLoaded(): Promise<AppStoreData> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.cache = hydrateStoreData(JSON.parse(raw));
      return this.cache;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code !== "ENOENT") {
        throw error;
      }

      this.cache = createEmptyStore();
      await this.persist(this.cache);
      return this.cache;
    }
  }

  private async persist(data: AppStoreData): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const tempFilePath = `${this.filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
    const fileHandle = await fs.open(tempFilePath, "w");

    try {
      await fileHandle.writeFile(JSON.stringify(data, null, 2), "utf8");
      await fileHandle.sync();
    } finally {
      await fileHandle.close();
    }

    await fs.rename(tempFilePath, this.filePath);
  }

  private async read<T>(reader: (data: AppStoreData) => T | Promise<T>): Promise<T> {
    await this.writeQueue;
    const data = await this.ensureLoaded();
    return cloneValue(await reader(data));
  }

  private async update<T>(
    writer: (data: AppStoreData) => T | Promise<T>,
  ): Promise<T> {
    const operation = this.writeQueue.then(async () => {
      const currentData = await this.ensureLoaded();
      const nextData = cloneValue(currentData);
      const result = await writer(nextData);
      await this.persist(nextData);
      this.cache = nextData;
      return cloneValue(result);
    });

    this.writeQueue = operation.then(
      () => undefined,
      () => undefined,
    );

    return operation;
  }

  private appendAuditEvent(
    data: AppStoreData,
    input: Omit<InternalAuditEventRecord, "id" | "createdAt">,
  ) {
    data.auditEvents.push({
      id: makeId("audit"),
      createdAt: new Date().toISOString(),
      ...input,
    });
  }

  private upsertProductFunnelEvent(
    data: AppStoreData,
    input: {
      eventType: ProductFunnelEventType;
      flowId: string;
      sourcePath: string;
      draftId: string | null;
      teamId: string | null;
      userId: string | null;
    },
    ipAddress: string,
  ): { created: boolean } {
    const existingRecord = data.productFunnelEvents.find(
      (event) => event.flowId === input.flowId && event.eventType === input.eventType,
    );

    if (existingRecord) {
      existingRecord.sourcePath = normalizeSourcePath(input.sourcePath) || existingRecord.sourcePath;
      existingRecord.draftId = input.draftId ?? existingRecord.draftId;
      existingRecord.teamId = input.teamId ?? existingRecord.teamId;
      existingRecord.userId = input.userId ?? existingRecord.userId;
      existingRecord.updatedAt = new Date().toISOString();
      return { created: false };
    }

    const now = new Date().toISOString();
    const record: InternalProductFunnelEventRecord = {
      id: makeId("funnel"),
      flowId: input.flowId,
      eventType: input.eventType,
      sourcePath: normalizeSourcePath(input.sourcePath),
      draftId: input.draftId,
      teamId: input.teamId,
      userId: input.userId,
      createdAt: now,
      updatedAt: now,
    };

    data.productFunnelEvents.push(record);
    this.appendAuditEvent(data, {
      teamId: input.teamId,
      actorUserId: input.userId,
      entityType: "product",
      entityId: record.id,
      action: input.eventType,
      ipAddress,
      metadata: {
        flowId: input.flowId,
        draftId: input.draftId ?? "",
        sourcePath: record.sourcePath,
      },
    });

    return { created: true };
  }

  private attachDraftContextToFunnelEvents(
    data: AppStoreData,
    draft: DraftRecord,
  ) {
    const matchingEvents = data.productFunnelEvents.filter(
      (event) => event.flowId === draft.sessionMeta.id,
    );

    for (const event of matchingEvents) {
      event.draftId = draft.id;
      event.teamId = draft.teamId;
      event.userId = draft.updatedByUserId;
      event.updatedAt = draft.updatedAt;
    }
  }

  private recordPaymentCompletedForDraft(
    data: AppStoreData,
    input: {
      draftId: string | null;
      teamId: string | null;
      userId: string | null;
      sourcePath: string;
      completedAt: string | null;
      paymentStatus: string | null;
      status: string | null;
    },
    ipAddress: string,
  ) {
    const isPaid =
      input.completedAt !== null || input.paymentStatus === "paid" || input.status === "complete";
    if (!isPaid || !input.draftId || !input.teamId) {
      return;
    }

    const draft = data.drafts.find(
      (candidate) => candidate.id === input.draftId && candidate.teamId === input.teamId,
    );
    if (!draft) {
      return;
    }

    this.upsertProductFunnelEvent(
      data,
      {
        eventType: "payment_completed",
        flowId: draft.sessionMeta.id,
        sourcePath: input.sourcePath,
        draftId: draft.id,
        teamId: draft.teamId,
        userId: input.userId ?? draft.updatedByUserId,
      },
      ipAddress,
    );
  }

  async getSessionByToken(token: string): Promise<AuthSessionSummary | null> {
    const normalizedToken = normalizeText(token);
    if (normalizedToken.length === 0) {
      return null;
    }

    return this.update((data) => {
      const tokenHash = crypto
        .createHash("sha256")
        .update(normalizedToken)
        .digest("hex");
      const now = Date.now();
      data.authSessions = data.authSessions.filter(
        (session) => Date.parse(session.expiresAt) > now,
      );

      const authSession = data.authSessions.find((session) =>
        timingSafeMatch(session.tokenHash, tokenHash),
      );
      if (!authSession) {
        return null;
      }

      authSession.lastSeenAt = new Date(now).toISOString();

      const user = data.users.find((candidate) => candidate.id === authSession.userId);
      const team = data.teams.find((candidate) => candidate.id === authSession.teamId);

      if (!user || !team) {
        return null;
      }

      return {
        user: sanitizeUser(user),
        team: sanitizeTeam(team),
      };
    });
  }

  async registerOwnerAccount(input: CreateOwnerAccountInput): Promise<AuthSessionSummary> {
    return this.update((data) => {
      const email = normalizeEmail(input.email);
      if (data.users.some((user) => user.email === email)) {
        throw new Error("An account with this email already exists.");
      }

      const now = new Date().toISOString();
      const baseSlug = slugify(input.teamName);
      let slug = baseSlug;
      let suffix = 2;
      while (data.teams.some((team) => team.slug === slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }

      const team: InternalTeamRecord = {
        id: makeId("team"),
        name: normalizeText(input.teamName),
        slug,
        createdAt: now,
        updatedAt: now,
      };

      const passwordSalt = crypto.randomBytes(16).toString("hex");
      const user: InternalUserRecord = {
        id: makeId("user"),
        teamId: team.id,
        name: normalizeText(input.name),
        email,
        role: "owner",
        passwordSalt,
        passwordHash: hashSecret(input.password, passwordSalt),
        createdAt: now,
        updatedAt: now,
      };

      data.teams.push(team);
      data.users.push(user);

      this.appendAuditEvent(data, {
        teamId: team.id,
        actorUserId: user.id,
        entityType: "auth",
        entityId: user.id,
        action: "register_owner",
        ipAddress: "",
        metadata: {
          email: user.email,
        },
      });

      return {
        user: sanitizeUser(user),
        team: sanitizeTeam(team),
      };
    });
  }

  async authenticateUser(emailInput: string, password: string): Promise<AuthSessionSummary | null> {
    return this.read((data) => {
      const email = normalizeEmail(emailInput);
      const user = data.users.find((candidate) => candidate.email === email);
      if (!user) {
        return null;
      }

      const passwordHash = hashSecret(password, user.passwordSalt);
      if (!timingSafeMatch(user.passwordHash, passwordHash)) {
        return null;
      }

      const team = data.teams.find((candidate) => candidate.id === user.teamId);
      if (!team) {
        return null;
      }

      return {
        user: sanitizeUser(user),
        team: sanitizeTeam(team),
      };
    });
  }

  async createAuthSession(
    summary: AuthSessionSummary,
    context: SessionContext,
  ): Promise<{ token: string; session: AuthSessionSummary }> {
    return this.update((data) => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + sessionDurationMs);
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      data.authSessions.push({
        id: makeId("session"),
        teamId: summary.team.id,
        userId: summary.user.id,
        tokenHash,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        lastSeenAt: now.toISOString(),
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
      });

      this.appendAuditEvent(data, {
        teamId: summary.team.id,
        actorUserId: summary.user.id,
        entityType: "auth",
        entityId: summary.user.id,
        action: "login",
        ipAddress: context.ipAddress,
        metadata: {
          userAgent: context.userAgent,
        },
      });

      return {
        token,
        session: summary,
      };
    });
  }

  async revokeSession(token: string, ipAddress: string): Promise<void> {
    const normalizedToken = normalizeText(token);
    if (normalizedToken.length === 0) {
      return;
    }

    await this.update((data) => {
      const tokenHash = crypto
        .createHash("sha256")
        .update(normalizedToken)
        .digest("hex");
      const existingSession = data.authSessions.find((session) =>
        timingSafeMatch(session.tokenHash, tokenHash),
      );

      data.authSessions = data.authSessions.filter(
        (session) => !timingSafeMatch(session.tokenHash, tokenHash),
      );

      if (existingSession) {
        this.appendAuditEvent(data, {
          teamId: existingSession.teamId,
          actorUserId: existingSession.userId,
          entityType: "auth",
          entityId: existingSession.userId,
          action: "logout",
          ipAddress,
          metadata: {},
        });
      }
    });
  }

  async listTeamUsers(teamId: string): Promise<UserSummary[]> {
    return this.read((data) =>
      data.users
        .filter((user) => user.teamId === teamId)
        .map((user) => sanitizeUser(user))
        .sort((left, right) => left.name.localeCompare(right.name)),
    );
  }

  async listTeamDrafts(teamId: string): Promise<DraftSummary[]> {
    return this.read((data) => {
      const usersById = new Map(data.users.map((user) => [user.id, user]));

      return data.drafts
        .filter((draft) => draft.teamId === teamId)
        .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
        .map((draft) => ({
          id: draft.id,
          title: draft.title,
          status: draft.status,
          suspicionLevel: draft.suspicionLevel,
          readinessStatus: draft.readinessStatus,
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt,
          createdByName: usersById.get(draft.createdByUserId)?.name ?? "Unknown user",
          assignedReviewerName:
            draft.assignedReviewerUserId &&
            usersById.get(draft.assignedReviewerUserId)?.name
              ? usersById.get(draft.assignedReviewerUserId)!.name
              : null,
        }));
    });
  }

  async getDraftForTeam(
    draftId: string,
    teamId: string,
    actorUserId: string,
    ipAddress: string,
  ): Promise<DraftRecord | null> {
    return this.update((data) => {
      const draft = data.drafts.find(
        (candidate) => candidate.id === draftId && candidate.teamId === teamId,
      );
      if (!draft) {
        return null;
      }

      draft.lastOpenedAt = new Date().toISOString();

      this.appendAuditEvent(data, {
        teamId,
        actorUserId,
        entityType: "draft",
        entityId: draft.id,
        action: "open",
        ipAddress,
        metadata: {
          status: draft.status,
        },
      });

      return draft;
    });
  }

  async getDraftSnapshot(teamId: string, draftId: string): Promise<DraftRecord | null> {
    return this.read((data) => {
      const draft = data.drafts.find(
        (candidate) => candidate.id === draftId && candidate.teamId === teamId,
      );

      return draft ? cloneValue(draft) : null;
    });
  }

  async saveDraft(
    teamId: string,
    actorUserId: string,
    request: SaveDraftRequest,
    ipAddress: string,
  ): Promise<DraftRecord> {
    return this.update((data) => {
      const normalizedIntake = normalizeStrIntake(request.intake);
      const generatedDraft = buildStrDraft(normalizedIntake);
      const reviewerId =
        request.assignedReviewerUserId &&
        data.users.some(
          (candidate) =>
            candidate.id === request.assignedReviewerUserId &&
            candidate.teamId === teamId,
        )
          ? request.assignedReviewerUserId
          : null;
      const status = ensureDraftStatus(request.status);
      const lastWorkflowView = ensureWorkflowStepView(request.lastWorkflowView);
      const now = new Date().toISOString();
      const title = deriveDraftTitle({
        title: request.title,
        intake: normalizedIntake,
        sessionId: request.sessionMeta.id,
      });

      let record = request.draftId
        ? data.drafts.find(
            (candidate) => candidate.id === request.draftId && candidate.teamId === teamId,
          )
        : undefined;

      if (record) {
        const expectedUpdatedAt = normalizeText(request.expectedUpdatedAt ?? "");
        if (expectedUpdatedAt.length === 0 || record.updatedAt !== expectedUpdatedAt) {
          throw new DraftConflictError(
            "This draft changed since your last saved version. Reopen it before saving again to avoid overwriting newer data.",
          );
        }

        record.title = title;
        record.status = status;
        record.assignedReviewerUserId = reviewerId;
        record.lastWorkflowView = lastWorkflowView;
        record.sessionMeta = cloneValue(request.sessionMeta);
        record.intake = normalizedIntake;
        record.narrativeText = request.narrativeText.trim();
        record.suspicionLevel = generatedDraft.suspicionLevel;
        record.readinessStatus = generatedDraft.readiness.status;
        record.updatedAt = now;
        record.updatedByUserId = actorUserId;
      } else {
        record = {
          id: makeId("draft"),
          teamId,
          createdByUserId: actorUserId,
          updatedByUserId: actorUserId,
          assignedReviewerUserId: reviewerId,
          title,
          status,
          lastWorkflowView,
          sessionMeta: cloneValue(request.sessionMeta),
          intake: normalizedIntake,
          narrativeText: request.narrativeText.trim(),
          suspicionLevel: generatedDraft.suspicionLevel,
          readinessStatus: generatedDraft.readiness.status,
          createdAt: now,
          updatedAt: now,
          lastOpenedAt: null,
          lastExportedAt: null,
        };
        data.drafts.push(record);
      }

      this.appendAuditEvent(data, {
        teamId,
        actorUserId,
        entityType: "draft",
        entityId: record.id,
        action: request.draftId ? "save" : "create",
        ipAddress,
        metadata: {
          status: record.status,
          view: record.lastWorkflowView,
          readiness: record.readinessStatus,
        },
      });

      this.attachDraftContextToFunnelEvents(data, record);

      return record;
    });
  }

  async recordDraftExport(
    teamId: string,
    actorUserId: string,
    draftId: string,
    format: "narrative" | "package",
    ipAddress: string,
  ): Promise<DraftRecord | null> {
    return this.update((data) => {
      const draft = data.drafts.find(
        (candidate) => candidate.id === draftId && candidate.teamId === teamId,
      );
      if (!draft) {
        return null;
      }

      const now = new Date().toISOString();
      draft.lastExportedAt = now;
      data.draftExports.push({
        id: makeId("export"),
        teamId,
        draftId,
        exportedByUserId: actorUserId,
        format,
        createdAt: now,
      });

      this.appendAuditEvent(data, {
        teamId,
        actorUserId,
        entityType: "draft",
        entityId: draftId,
        action: "export",
        ipAddress,
        metadata: {
          format,
        },
      });

      return draft;
    });
  }

  async createProductEnquiry(input: ProductEnquiryRequest, ipAddress: string): Promise<string> {
    return this.update((data) => {
      const enquiry: InternalProductEnquiryRecord = {
        id: makeId("enquiry"),
        name: normalizeText(input.name ?? ""),
        email: normalizeEmail(input.email),
        phone: normalizeText(input.phone ?? ""),
        company: normalizeText(input.company ?? ""),
        sourcePath: normalizeText(input.sourcePath),
        createdAt: new Date().toISOString(),
        status: "new",
      };

      data.enquiries.push(enquiry);
      this.appendAuditEvent(data, {
        teamId: null,
        actorUserId: null,
        entityType: "enquiry",
        entityId: enquiry.id,
        action: "create",
        ipAddress,
        metadata: {
          sourcePath: enquiry.sourcePath,
          email: enquiry.email,
          ...(enquiry.phone ? { phone: enquiry.phone } : {}),
        },
      });

      return enquiry.id;
    });
  }

  async recordProductFunnelEvent(
    input: {
      eventType: ProductFunnelEventType;
      flowId: string;
      sourcePath: string;
      draftId: string | null;
      teamId: string | null;
      userId: string | null;
    },
    ipAddress: string,
  ): Promise<{ created: boolean }> {
    return this.update((data) =>
      this.upsertProductFunnelEvent(
        data,
        {
          eventType: input.eventType,
          flowId: normalizeText(input.flowId),
          sourcePath: normalizeSourcePath(input.sourcePath),
          draftId: input.draftId,
          teamId: input.teamId,
          userId: input.userId,
        },
        ipAddress,
      ),
    );
  }

  async getProductFunnelSummary(): Promise<ProductFunnelSummary> {
    return this.read((data) => {
      const startedFlows = new Set(
        data.productFunnelEvents
          .filter((event) => event.eventType === "str_started")
          .map((event) => event.flowId),
      );
      const completedFlows = new Set(
        data.productFunnelEvents
          .filter((event) => event.eventType === "str_completed")
          .map((event) => event.flowId),
      );
      const exportFlows = new Set(
        data.productFunnelEvents
          .filter((event) => event.eventType === "export_initiated")
          .map((event) => event.flowId),
      );
      const paymentFlows = new Set(
        data.productFunnelEvents
          .filter((event) => event.eventType === "payment_completed")
          .map((event) => event.flowId),
      );

      const lastEventAt = data.productFunnelEvents.reduce<string | null>((latest, event) => {
        if (!latest || Date.parse(event.updatedAt) > Date.parse(latest)) {
          return event.updatedAt;
        }

        return latest;
      }, null);

      return {
        counts: {
          strStarted: startedFlows.size,
          strCompleted: completedFlows.size,
          exportInitiated: exportFlows.size,
          paymentCompleted: paymentFlows.size,
        },
        rates: {
          completionFromStarted: formatPercentage(completedFlows.size, startedFlows.size),
          reachExportFromStarted: formatPercentage(exportFlows.size, startedFlows.size),
          paymentFromExportInitiated: formatPercentage(paymentFlows.size, exportFlows.size),
          paymentFromStarted: formatPercentage(paymentFlows.size, startedFlows.size),
        },
        dropOffs: {
          startedWithoutCompletion: Array.from(startedFlows).filter(
            (flowId) => !completedFlows.has(flowId),
          ).length,
          completedWithoutExportInitiated: Array.from(completedFlows).filter(
            (flowId) => !exportFlows.has(flowId),
          ).length,
          exportInitiatedWithoutPayment: Array.from(exportFlows).filter(
            (flowId) => !paymentFlows.has(flowId),
          ).length,
        },
        lastEventAt,
      };
    });
  }

  async recordStripeWebhookEvent(
    input: {
      eventId: string;
      eventType: string;
      objectId: string | null;
      livemode: boolean;
      apiVersion: string | null;
      account: string | null;
      payload: string;
    },
    ipAddress: string,
  ): Promise<{ duplicate: boolean }> {
    return this.update((data) => {
      if (data.stripeWebhookEvents.some((event) => event.id === input.eventId)) {
        return { duplicate: true };
      }

      const receivedAt = new Date().toISOString();
      const payloadHash = crypto
        .createHash("sha256")
        .update(input.payload)
        .digest("hex");

      data.stripeWebhookEvents.push({
        id: input.eventId,
        type: input.eventType,
        objectId: input.objectId,
        livemode: input.livemode,
        apiVersion: input.apiVersion,
        account: input.account,
        receivedAt,
        payloadHash,
      });

      this.appendAuditEvent(data, {
        teamId: null,
        actorUserId: null,
        entityType: "billing",
        entityId: input.eventId,
        action: "webhook_received",
        ipAddress,
        metadata: {
          type: input.eventType,
          objectId: input.objectId ?? "",
          livemode: input.livemode ? "true" : "false",
        },
      });

      return { duplicate: false };
    });
  }

  async recordBillingCheckoutSession(
    input: {
      sessionId: string;
      checkoutUrl: string | null;
      sourcePath: string;
      draftId: string | null;
      teamId: string | null;
      userId: string | null;
      customerEmail: string | null;
      clientReferenceId: string | null;
      status: string | null;
      paymentStatus: string | null;
      amountTotal: number | null;
      currency: string | null;
      livemode: boolean;
    },
    ipAddress: string,
  ): Promise<{ created: boolean }> {
    return this.update((data) => {
      const now = new Date().toISOString();
      const normalizedSourcePath = normalizeSourcePath(input.sourcePath);
      const normalizedDraftId =
        input.draftId && normalizeText(input.draftId).length > 0 ? normalizeText(input.draftId) : null;
      const normalizedCustomerEmail =
        input.customerEmail && normalizeText(input.customerEmail).length > 0
          ? normalizeEmail(input.customerEmail)
          : null;
      const existingRecord = data.billingCheckoutSessions.find(
        (session) => session.id === input.sessionId,
      );

      if (existingRecord) {
        existingRecord.checkoutUrl = input.checkoutUrl ?? existingRecord.checkoutUrl;
        existingRecord.sourcePath = normalizedSourcePath || existingRecord.sourcePath;
        existingRecord.draftId = normalizedDraftId ?? existingRecord.draftId;
        existingRecord.teamId = input.teamId ?? existingRecord.teamId;
        existingRecord.userId = input.userId ?? existingRecord.userId;
        existingRecord.customerEmail = normalizedCustomerEmail ?? existingRecord.customerEmail;
        existingRecord.clientReferenceId =
          input.clientReferenceId ?? existingRecord.clientReferenceId;
        existingRecord.status = input.status ?? existingRecord.status;
        existingRecord.paymentStatus = input.paymentStatus ?? existingRecord.paymentStatus;
        existingRecord.amountTotal =
          typeof input.amountTotal === "number" ? input.amountTotal : existingRecord.amountTotal;
        existingRecord.currency = input.currency ?? existingRecord.currency;
        existingRecord.livemode = input.livemode;
        existingRecord.updatedAt = now;
        if (
          !existingRecord.completedAt &&
          (input.status === "complete" || input.paymentStatus === "paid")
        ) {
          existingRecord.completedAt = now;
        }

        this.appendAuditEvent(data, {
          teamId: existingRecord.teamId,
          actorUserId: existingRecord.userId,
          entityType: "billing",
          entityId: input.sessionId,
          action: "checkout_session_updated",
          ipAddress,
          metadata: {
            sourcePath: existingRecord.sourcePath,
            draftId: existingRecord.draftId ?? "",
            paymentStatus: existingRecord.paymentStatus ?? "",
            status: existingRecord.status ?? "",
          },
        });

        this.recordPaymentCompletedForDraft(
          data,
          {
            draftId: existingRecord.draftId,
            teamId: existingRecord.teamId,
            userId: existingRecord.userId,
            sourcePath: existingRecord.sourcePath,
            completedAt: existingRecord.completedAt,
            paymentStatus: existingRecord.paymentStatus,
            status: existingRecord.status,
          },
          ipAddress,
        );

        return { created: false };
      }

      const createdRecord: InternalBillingCheckoutSessionRecord = {
        id: input.sessionId,
        checkoutUrl: input.checkoutUrl,
        sourcePath: normalizedSourcePath,
        draftId: normalizedDraftId,
        teamId: input.teamId,
        userId: input.userId,
        customerEmail: normalizedCustomerEmail,
        clientReferenceId: input.clientReferenceId,
        status: input.status,
        paymentStatus: input.paymentStatus,
        amountTotal: input.amountTotal,
        currency: input.currency,
        livemode: input.livemode,
        createdAt: now,
        updatedAt: now,
        completedAt:
          input.status === "complete" || input.paymentStatus === "paid" ? now : null,
      };
      data.billingCheckoutSessions.push(createdRecord);

      this.appendAuditEvent(data, {
        teamId: input.teamId,
        actorUserId: input.userId,
        entityType: "billing",
        entityId: input.sessionId,
        action: "checkout_session_recorded",
        ipAddress,
        metadata: {
          sourcePath: normalizedSourcePath,
          draftId: normalizedDraftId ?? "",
          paymentStatus: input.paymentStatus ?? "",
          status: input.status ?? "",
          customerEmail: normalizedCustomerEmail ?? "",
        },
      });

      this.recordPaymentCompletedForDraft(
        data,
        {
          draftId: createdRecord.draftId,
          teamId: createdRecord.teamId,
          userId: createdRecord.userId,
          sourcePath: createdRecord.sourcePath,
          completedAt: createdRecord.completedAt,
          paymentStatus: createdRecord.paymentStatus,
          status: createdRecord.status,
        },
        ipAddress,
      );

      return { created: true };
    });
  }

  async getDraftExportAccess(
    teamId: string,
    draftId: string,
  ): Promise<{ unlocked: boolean; paidCheckoutSessionId: string | null }> {
    return this.read((data) => {
      const matchingPaidSessions = data.billingCheckoutSessions
        .filter(
          (session) =>
            session.teamId === teamId &&
            session.draftId === draftId &&
            (session.completedAt !== null ||
              session.status === "complete" ||
              session.paymentStatus === "paid"),
        )
        .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));

      return {
        unlocked: matchingPaidSessions.length > 0,
        paidCheckoutSessionId: matchingPaidSessions[0]?.id ?? null,
      };
    });
  }
}
