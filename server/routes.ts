import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { createEmptyStrIntake, type StrIntake } from "@shared/str";
import { clearSessionCookie, getRequestIpAddress, getRequestUserAgent, readSessionToken, setSessionCookie } from "./auth";
import { buildApiErrorResponse, buildHealthResponse } from "./http";
import { PersistentAppStore } from "./persistence";
import {
  StripeWebhookVerificationError,
  verifyStripeWebhookEvent,
} from "./stripe";
import type {
  AuthSessionSummary,
  DraftStatus,
  LoginRequest,
  ProductEnquiryRequest,
  RecordDraftExportRequest,
  RegisterRequest,
  SaveDraftRequest,
} from "@shared/workspace";

type RegisterRoutesOptions = {
  store?: PersistentAppStore;
};

function sendApiError(res: Response, status: number, message: string, code: string) {
  res.status(status).json(buildApiErrorResponse(message, code));
}

function isValidEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value);
}

function readRawRequestBody(req: Request): string | Buffer | null {
  if (Buffer.isBuffer(req.rawBody)) {
    return req.rawBody;
  }

  if (typeof req.rawBody === "string") {
    return req.rawBody;
  }

  return null;
}

async function resolveSession(
  store: PersistentAppStore,
  req: Request,
): Promise<AuthSessionSummary | null> {
  const token = readSessionToken(req);
  if (!token) {
    return null;
  }

  return store.getSessionByToken(token);
}

async function requireSession(
  store: PersistentAppStore,
  req: Request,
  res: Response,
): Promise<AuthSessionSummary | null> {
  const session = await resolveSession(store, req);
  if (!session) {
    clearSessionCookie(res);
    sendApiError(res, 401, "Sign in is required.", "unauthorized");
    return null;
  }

  return session;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  options: RegisterRoutesOptions = {},
): Promise<Server> {
  const store = options.store ?? new PersistentAppStore();

  app.get("/api/health", (_req, res) => {
    res.json(buildHealthResponse());
  });

  app.get("/api/auth/session", async (req, res) => {
    const session = await resolveSession(store, req);
    if (!session) {
      clearSessionCookie(res);
    }

    res.json({
      ok: true,
      session,
    });
  });

  app.post("/api/auth/register", async (req, res) => {
    const body = (req.body ?? {}) as Partial<RegisterRequest>;
    const teamName = typeof body.teamName === "string" ? body.teamName.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (teamName.length === 0 || name.length === 0) {
      return sendApiError(
        res,
        400,
        "Team name and full name are required.",
        "invalid_registration",
      );
    }

    if (!isValidEmail(email)) {
      return sendApiError(res, 400, "A valid email is required.", "invalid_registration");
    }

    if (password.length < 8) {
      return sendApiError(
        res,
        400,
        "Use a password with at least 8 characters.",
        "invalid_registration",
      );
    }

    try {
      const summary = await store.registerOwnerAccount({
        teamName,
        name,
        email,
        password,
      });
      const createdSession = await store.createAuthSession(summary, {
        ipAddress: getRequestIpAddress(req),
        userAgent: getRequestUserAgent(req),
      });
      setSessionCookie(res, createdSession.token);
      return res.status(201).json({
        ok: true,
        session: createdSession.session,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration could not be completed.";
      return sendApiError(res, 400, message, "invalid_registration");
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const body = (req.body ?? {}) as Partial<LoginRequest>;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!isValidEmail(email) || password.length === 0) {
      return sendApiError(res, 400, "Email and password are required.", "invalid_login");
    }

    const summary = await store.authenticateUser(email, password);
    if (!summary) {
      return sendApiError(res, 401, "Invalid email or password.", "invalid_login");
    }

    const createdSession = await store.createAuthSession(summary, {
      ipAddress: getRequestIpAddress(req),
      userAgent: getRequestUserAgent(req),
    });
    setSessionCookie(res, createdSession.token);
    res.json({
      ok: true,
      session: createdSession.session,
    });
  });

  app.post("/api/auth/logout", async (req, res) => {
    const token = readSessionToken(req);
    if (token) {
      await store.revokeSession(token, getRequestIpAddress(req));
    }

    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get("/api/workspace", async (req, res) => {
    const session = await requireSession(store, req, res);
    if (!session) {
      return;
    }

    const [drafts, reviewers] = await Promise.all([
      store.listTeamDrafts(session.team.id),
      store.listTeamUsers(session.team.id),
    ]);

    res.json({
      ok: true,
      drafts,
      reviewers,
    });
  });

  app.get("/api/drafts/:draftId", async (req, res) => {
    const session = await requireSession(store, req, res);
    if (!session) {
      return;
    }

    const draft = await store.getDraftForTeam(
      req.params.draftId,
      session.team.id,
      session.user.id,
      getRequestIpAddress(req),
    );
    if (!draft) {
      return sendApiError(res, 404, "Draft not found.", "draft_not_found");
    }

    res.json({
      ok: true,
      draft,
    });
  });

  app.post("/api/drafts", async (req, res) => {
    const session = await requireSession(store, req, res);
    if (!session) {
      return;
    }

    const body = (req.body ?? {}) as Partial<SaveDraftRequest>;
    if (!body.sessionMeta || typeof body.sessionMeta.id !== "string") {
      return sendApiError(res, 400, "Session metadata is required.", "invalid_draft");
    }

    const request: SaveDraftRequest = {
      draftId: typeof body.draftId === "string" ? body.draftId : undefined,
      title: typeof body.title === "string" ? body.title : "",
      status:
        body.status === "in_review" ||
        body.status === "ready_for_filing" ||
        body.status === "archived"
          ? body.status
          : ("draft" as DraftStatus),
      assignedReviewerUserId:
        typeof body.assignedReviewerUserId === "string" && body.assignedReviewerUserId.length > 0
          ? body.assignedReviewerUserId
          : null,
      lastWorkflowView:
        body.lastWorkflowView === "review" ||
        body.lastWorkflowView === "narrative" ||
        body.lastWorkflowView === "output"
          ? body.lastWorkflowView
          : "intake",
      sessionMeta: {
        id: body.sessionMeta.id,
        timestamp:
          typeof body.sessionMeta.timestamp === "string"
            ? body.sessionMeta.timestamp
            : new Date().toISOString(),
      },
      intake:
        body.intake && typeof body.intake === "object"
          ? (body.intake as StrIntake)
          : createEmptyStrIntake(),
      narrativeText: typeof body.narrativeText === "string" ? body.narrativeText : "",
    };

    const draft = await store.saveDraft(
      session.team.id,
      session.user.id,
      request,
      getRequestIpAddress(req),
    );

    res.status(request.draftId ? 200 : 201).json({
      ok: true,
      draft,
    });
  });

  app.post("/api/drafts/:draftId/export", async (req, res) => {
    const session = await requireSession(store, req, res);
    if (!session) {
      return;
    }

    const body = (req.body ?? {}) as Partial<RecordDraftExportRequest>;
    const format = body.format === "package" ? "package" : body.format === "narrative" ? "narrative" : null;
    if (!format) {
      return sendApiError(res, 400, "A valid export format is required.", "invalid_export");
    }

    const draft = await store.recordDraftExport(
      session.team.id,
      session.user.id,
      req.params.draftId,
      format,
      getRequestIpAddress(req),
    );
    if (!draft) {
      return sendApiError(res, 404, "Draft not found.", "draft_not_found");
    }

    res.json({
      ok: true,
      draft,
    });
  });

  app.post("/api/enquiries", async (req, res) => {
    const body = (req.body ?? {}) as Partial<ProductEnquiryRequest>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const sourcePath = typeof body.sourcePath === "string" ? body.sourcePath.trim() : "";

    if (name.length === 0 || !isValidEmail(email)) {
      return sendApiError(res, 400, "Name and a valid email are required.", "invalid_enquiry");
    }

    const enquiryId = await store.createProductEnquiry(
      {
        name,
        email,
        company,
        sourcePath: sourcePath || "/finsure",
      },
      getRequestIpAddress(req),
    );

    res.status(201).json({
      ok: true,
      enquiryId,
    });
  });

  app.post("/api/billing/webhook", async (req, res) => {
    const rawBody = readRawRequestBody(req);
    if (!rawBody) {
      return sendApiError(
        res,
        400,
        "Stripe webhook payload could not be verified because the raw body was unavailable.",
        "invalid_webhook_payload",
      );
    }

    try {
      const event = verifyStripeWebhookEvent(
        rawBody,
        typeof req.headers["stripe-signature"] === "string"
          ? req.headers["stripe-signature"]
          : undefined,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      const recordResult = await store.recordStripeWebhookEvent(
        {
          eventId: event.id,
          eventType: event.type,
          objectId: typeof event.data.object.id === "string" ? event.data.object.id : null,
          livemode: event.livemode,
          apiVersion: event.api_version,
          account: event.account ?? null,
          payload: typeof rawBody === "string" ? rawBody : rawBody.toString("utf8"),
        },
        getRequestIpAddress(req),
      );

      if (recordResult.duplicate) {
        return res.status(200).json({
          ok: true,
          received: true,
          duplicate: true,
        });
      }

      return res.status(200).json({
        ok: true,
        received: true,
      });
    } catch (error) {
      if (error instanceof StripeWebhookVerificationError) {
        const status = error.code === "missing_secret" ? 503 : 400;
        return sendApiError(res, status, error.message, error.code);
      }

      return sendApiError(
        res,
        500,
        "Stripe webhook handling failed.",
        "stripe_webhook_error",
      );
    }
  });

  app.use("/api", (_req, res) => {
    res.status(404).json(buildApiErrorResponse("API route not found.", "not_found"));
  });

  return httpServer;
}
