import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
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

type InternalAuditEventRecord = {
  id: string;
  teamId: string | null;
  actorUserId: string | null;
  entityType: "auth" | "draft" | "enquiry";
  entityId: string;
  action: string;
  createdAt: string;
  ipAddress: string;
  metadata: Record<string, string>;
};

type AppStoreData = {
  teams: InternalTeamRecord[];
  users: InternalUserRecord[];
  authSessions: InternalAuthSessionRecord[];
  drafts: DraftRecord[];
  draftExports: InternalDraftExportRecord[];
  enquiries: InternalProductEnquiryRecord[];
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

function createEmptyStore(): AppStoreData {
  return {
    teams: [],
    users: [],
    authSessions: [],
    drafts: [],
    draftExports: [],
    enquiries: [],
    auditEvents: [],
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
      this.cache = JSON.parse(raw) as AppStoreData;
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
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf8");
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
      const data = await this.ensureLoaded();
      const result = await writer(data);
      await this.persist(data);
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
      draft.updatedAt = now;
      draft.updatedByUserId = actorUserId;
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
        name: normalizeText(input.name),
        email: normalizeEmail(input.email),
        company: normalizeText(input.company),
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
        },
      });

      return enquiry.id;
    });
  }
}
