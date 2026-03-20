type EnvironmentMap = Record<string, string | undefined>;

export type ServerListenOptions = {
  port: number;
  host: string;
  reusePort?: boolean;
};

export type HealthResponse = {
  ok: true;
  mode: "client-first-mvp";
  product: "Finsurance";
};

export type ApiErrorResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

const defaultPort = 5000;
const hostedRuntimeEnvKeys = [
  "REPL_ID",
  "REPLIT_DEPLOYMENT",
  "RENDER",
  "RAILWAY_PROJECT_ID",
  "FLY_APP_NAME",
  "HEROKU_APP_ID",
  "KOYEB_APP_NAME",
];

function normalizeEnvValue(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parsePositiveIntParam(value: string | undefined): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function parsePort(value: string | undefined, fallback = defaultPort): number {
  return parsePositiveIntParam(normalizeEnvValue(value)) ?? fallback;
}

export function isHostedRuntime(env: EnvironmentMap = process.env): boolean {
  return hostedRuntimeEnvKeys.some((key) => normalizeEnvValue(env[key]).length > 0);
}

export function resolveServerHost(env: EnvironmentMap = process.env): string {
  const explicitHost =
    normalizeEnvValue(env.HOST) || normalizeEnvValue(env.LISTEN_HOST);

  if (explicitHost.length > 0) {
    return explicitHost;
  }

  return isHostedRuntime(env) ? "0.0.0.0" : "127.0.0.1";
}

export function resolveListenOptions(env: EnvironmentMap = process.env): ServerListenOptions {
  const host = resolveServerHost(env);

  return {
    port: parsePort(env.PORT),
    host,
    ...(host === "0.0.0.0" && normalizeEnvValue(env.REPL_ID).length > 0
      ? { reusePort: true }
      : {}),
  };
}

export function buildHealthResponse(): HealthResponse {
  return {
    ok: true,
    mode: "client-first-mvp",
    product: "Finsurance",
  };
}

export function buildApiErrorResponse(
  message: string,
  code = "internal_error",
): ApiErrorResponse {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}
