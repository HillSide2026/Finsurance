import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import {
  createServer,
  request as httpRequest,
  type IncomingHttpHeaders,
  type IncomingMessage,
} from "node:http";
import { type AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import express from "express";
import { createEmptyStrIntake } from "@shared/str";
import { sessionCookieName } from "./auth";
import { PersistentAppStore } from "./persistence";
import { registerRoutes } from "./routes";

type TestServer = {
  baseUrl: string;
  cleanup: () => Promise<void>;
};

type RouteJsonResponse<T> = {
  status: number;
  headers: IncomingHttpHeaders;
  body: T;
};

type JsonRequestOptions = {
  method?: string;
  cookie?: string;
  json?: unknown;
};

async function createRouteTestServer(): Promise<TestServer> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "finsurance-routes-"));
  const filePath = path.join(tempDir, "app-store.json");
  const store = new PersistentAppStore(filePath);
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as IncomingMessage & { rawBody: unknown }).rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  await registerRoutes(httpServer, app, { store });

  await new Promise<void>((resolve) => {
    httpServer.listen(0, "127.0.0.1", () => {
      resolve();
    });
  });

  const address = httpServer.address();
  assert.ok(address && typeof address !== "string");

  return {
    baseUrl: `http://127.0.0.1:${(address as AddressInfo).port}`,
    async cleanup() {
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
      await rm(tempDir, { recursive: true, force: true });
    },
  };
}

async function requestJson<T>(
  baseUrl: string,
  requestPath: string,
  options: JsonRequestOptions = {},
): Promise<RouteJsonResponse<T>> {
  const headers: Record<string, string> = {};
  let body: string | undefined;

  if (options.cookie) {
    headers.cookie = options.cookie;
  }

  if (options.json !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(options.json);
    headers["content-length"] = Buffer.byteLength(body).toString();
  }

  const url = new URL(requestPath, baseUrl);

  return new Promise<RouteJsonResponse<T>>((resolve, reject) => {
    const request = httpRequest(
      url,
      {
        method: options.method ?? (options.json !== undefined ? "POST" : "GET"),
        headers,
      },
      (response) => {
        let rawBody = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          rawBody += chunk;
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 0,
            headers: response.headers,
            body: JSON.parse(rawBody) as T,
          });
        });
      },
    );

    request.on("error", reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

function readSessionCookie(headers: IncomingHttpHeaders): string {
  const setCookieHeader = headers["set-cookie"];
  const cookieHeaders = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : typeof setCookieHeader === "string"
      ? [setCookieHeader]
      : [];

  const sessionCookie = cookieHeaders.find((cookie) =>
    cookie.startsWith(`${sessionCookieName}=`),
  );

  assert.ok(sessionCookie, "Expected a FinSure session cookie.");
  return sessionCookie.split(";")[0]!;
}

function buildDraftPayload(flowId: string, narrativeText: string) {
  return {
    title: "Route draft",
    status: "draft" as const,
    assignedReviewerUserId: null,
    lastWorkflowView: "output" as const,
    sessionMeta: {
      id: flowId,
      timestamp: new Date("2026-03-27T15:00:00.000Z").toISOString(),
    },
    intake: createEmptyStrIntake(),
    narrativeText,
  };
}

async function verifyAuthFlow(baseUrl: string) {
  const registerResponse = await requestJson<{
    ok: true;
    session: { user: { email: string } } | null;
  }>(baseUrl, "/api/auth/register", {
    json: {
      teamName: "Route Test Team",
      name: "Route Tester",
      email: "route.tester@example.com",
      password: "Password123",
    },
  });

  assert.equal(registerResponse.status, 201);
  assert.equal(registerResponse.body.session?.user.email, "route.tester@example.com");
  const sessionCookie = readSessionCookie(registerResponse.headers);

  const sessionResponse = await requestJson<{
    ok: true;
    session: { user: { email: string } } | null;
  }>(baseUrl, "/api/auth/session", {
    cookie: sessionCookie,
  });

  assert.equal(sessionResponse.status, 200);
  assert.equal(sessionResponse.body.session?.user.email, "route.tester@example.com");

  const logoutResponse = await requestJson<{ ok: true }>(baseUrl, "/api/auth/logout", {
    method: "POST",
    cookie: sessionCookie,
  });

  assert.equal(logoutResponse.status, 200);
  const clearedCookie = readSessionCookie(logoutResponse.headers);
  assert.match(clearedCookie, new RegExp(`^${sessionCookieName}=`));

  const postLogoutSession = await requestJson<{
    ok: true;
    session: null;
  }>(baseUrl, "/api/auth/session", {
    cookie: clearedCookie,
  });

  assert.equal(postLogoutSession.status, 200);
  assert.equal(postLogoutSession.body.session, null);

  const loginResponse = await requestJson<{
    ok: true;
    session: { user: { email: string } } | null;
  }>(baseUrl, "/api/auth/login", {
    json: {
      email: "route.tester@example.com",
      password: "Password123",
    },
  });

  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.body.session?.user.email, "route.tester@example.com");
  const loginCookie = readSessionCookie(loginResponse.headers);

  const restoredSession = await requestJson<{
    ok: true;
    session: { user: { email: string } } | null;
  }>(baseUrl, "/api/auth/session", {
    cookie: loginCookie,
  });

  assert.equal(restoredSession.status, 200);
  assert.equal(restoredSession.body.session?.user.email, "route.tester@example.com");
}

async function verifyDraftFlow(baseUrl: string) {
  const registerResponse = await requestJson<{
    ok: true;
    session: { user: { email: string } } | null;
  }>(baseUrl, "/api/auth/register", {
    json: {
      teamName: "Draft Route Team",
      name: "Draft Route Tester",
      email: "draft.route@example.com",
      password: "Password123",
    },
  });
  const sessionCookie = readSessionCookie(registerResponse.headers);

  const initialSave = await requestJson<{
    ok: true;
    draft: {
      id: string;
      title: string;
      narrativeText: string;
      updatedAt: string;
      sessionMeta: { id: string };
    };
  }>(baseUrl, "/api/drafts", {
    cookie: sessionCookie,
    json: buildDraftPayload("STR-ROUTE-001", "Initial route narrative"),
  });

  assert.equal(initialSave.status, 201);
  assert.equal(initialSave.body.draft.title, "Route draft");
  assert.equal(initialSave.body.draft.narrativeText, "Initial route narrative");

  const openedDraft = await requestJson<{
    ok: true;
    draft: {
      id: string;
      narrativeText: string;
      sessionMeta: { id: string };
    };
  }>(baseUrl, `/api/drafts/${encodeURIComponent(initialSave.body.draft.id)}`, {
    cookie: sessionCookie,
  });

  assert.equal(openedDraft.status, 200);
  assert.equal(openedDraft.body.draft.id, initialSave.body.draft.id);
  assert.equal(openedDraft.body.draft.sessionMeta.id, "STR-ROUTE-001");

  const secondSave = await requestJson<{
    ok: true;
    draft: {
      id: string;
      narrativeText: string;
      updatedAt: string;
    };
  }>(baseUrl, "/api/drafts", {
    cookie: sessionCookie,
    json: {
      ...buildDraftPayload("STR-ROUTE-001", "Updated route narrative"),
      draftId: initialSave.body.draft.id,
      expectedUpdatedAt: initialSave.body.draft.updatedAt,
    },
  });

  assert.equal(secondSave.status, 200);
  assert.equal(secondSave.body.draft.narrativeText, "Updated route narrative");

  const staleSave = await requestJson<{
    ok: false;
    error: { code: string; message: string };
  }>(baseUrl, "/api/drafts", {
    cookie: sessionCookie,
    json: {
      ...buildDraftPayload("STR-ROUTE-001", "Stale overwrite attempt"),
      draftId: initialSave.body.draft.id,
      expectedUpdatedAt: initialSave.body.draft.updatedAt,
    },
  });

  assert.equal(staleSave.status, 409);
  assert.equal(staleSave.body.error.code, "draft_conflict");
  assert.match(staleSave.body.error.message, /changed since your last saved version/i);
}

async function verifyBillingConfirmationFlow(baseUrl: string) {
  const originalSecretKey = process.env.STRIPE_SECRET_KEY;
  const originalPriceId = process.env.STRIPE_PRICE_ID;
  process.env.STRIPE_SECRET_KEY = "sk_test_123";
  process.env.STRIPE_PRICE_ID = "price_123";

  try {
    const registerResponse = await requestJson<{
      ok: true;
      session: { user: { id: string }; team: { id: string } } | null;
    }>(baseUrl, "/api/auth/register", {
      json: {
        teamName: "Billing Route Team",
        name: "Billing Route Tester",
        email: "billing.route@example.com",
        password: "Password123",
      },
    });

    const sessionCookie = readSessionCookie(registerResponse.headers);
    assert.ok(registerResponse.body.session);

    const savedDraft = await requestJson<{
      ok: true;
      draft: { id: string };
    }>(baseUrl, "/api/drafts", {
      cookie: sessionCookie,
      json: buildDraftPayload("STR-BILLING-001", "Billing confirmation narrative"),
    });

    assert.equal(savedDraft.status, 201);

    const exportAccessBefore = await requestJson<{
      ok: true;
      access: { unlocked: boolean; paidCheckoutSessionId: string | null };
    }>(
      baseUrl,
      `/api/drafts/${encodeURIComponent(savedDraft.body.draft.id)}/export-access`,
      {
        cookie: sessionCookie,
      },
    );

    assert.equal(exportAccessBefore.status, 200);
    assert.equal(exportAccessBefore.body.access.unlocked, false);
    assert.equal(exportAccessBefore.body.access.paidCheckoutSessionId, null);

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input) => {
      const url =
        typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      assert.equal(
        url,
        "https://api.stripe.com/v1/checkout/sessions/cs_test_confirmed",
      );

      return new Response(
        JSON.stringify({
          id: "cs_test_confirmed",
          url: "https://checkout.stripe.com/c/pay/cs_test_confirmed",
          mode: "payment",
          status: "complete",
          payment_status: "paid",
          livemode: false,
          customer_email: "billing.route@example.com",
          client_reference_id: `team:${registerResponse.body.session!.team.id}:user:${registerResponse.body.session!.user.id}:draft:${savedDraft.body.draft.id}`,
          amount_total: 900,
          currency: "cad",
          metadata: {
            source_path: "/finsure",
            team_id: registerResponse.body.session!.team.id,
            user_id: registerResponse.body.session!.user.id,
            draft_id: savedDraft.body.draft.id,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    };

    try {
      const reconcileResponse = await requestJson<{
        ok: true;
        session: { paymentStatus: string; draftId: string | null; id: string };
      }>(
        baseUrl,
        "/api/billing/checkout-session/cs_test_confirmed/reconcile",
        {
          method: "POST",
        },
      );

      assert.equal(reconcileResponse.status, 200);
      assert.equal(reconcileResponse.body.session.id, "cs_test_confirmed");
      assert.equal(reconcileResponse.body.session.paymentStatus, "paid");
      assert.equal(reconcileResponse.body.session.draftId, savedDraft.body.draft.id);
    } finally {
      globalThis.fetch = originalFetch;
    }

    const exportAccessAfter = await requestJson<{
      ok: true;
      access: { unlocked: boolean; paidCheckoutSessionId: string | null };
    }>(
      baseUrl,
      `/api/drafts/${encodeURIComponent(savedDraft.body.draft.id)}/export-access`,
      {
        cookie: sessionCookie,
      },
    );

    assert.equal(exportAccessAfter.status, 200);
    assert.equal(exportAccessAfter.body.access.unlocked, true);
    assert.equal(exportAccessAfter.body.access.paidCheckoutSessionId, "cs_test_confirmed");

    const exportResponse = await requestJson<{
      ok: true;
      draft: { id: string; lastExportedAt: string | null };
    }>(
      baseUrl,
      `/api/drafts/${encodeURIComponent(savedDraft.body.draft.id)}/export`,
      {
        method: "POST",
        cookie: sessionCookie,
        json: {
          format: "package",
        },
      },
    );

    assert.equal(exportResponse.status, 200);
    assert.equal(exportResponse.body.draft.id, savedDraft.body.draft.id);
    assert.ok(exportResponse.body.draft.lastExportedAt);
  } finally {
    process.env.STRIPE_SECRET_KEY = originalSecretKey;
    process.env.STRIPE_PRICE_ID = originalPriceId;
  }
}

async function main() {
  const authServer = await createRouteTestServer();
  try {
    await verifyAuthFlow(authServer.baseUrl);
  } finally {
    await authServer.cleanup();
  }

  const draftServer = await createRouteTestServer();
  try {
    await verifyDraftFlow(draftServer.baseUrl);
  } finally {
    await draftServer.cleanup();
  }

  const billingServer = await createRouteTestServer();
  try {
    await verifyBillingConfirmationFlow(billingServer.baseUrl);
  } finally {
    await billingServer.cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
