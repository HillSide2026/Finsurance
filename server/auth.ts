import type { Request, Response } from "express";

export const sessionCookieName = "finsure_session";

type CookieOptions = {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

function encodeCookieValue(value: string): string {
  return encodeURIComponent(value);
}

function serializeCookie(name: string, value: string, options: CookieOptions): string {
  const parts = [`${name}=${encodeCookieValue(value)}`];

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  parts.push(`Path=${options.path ?? "/"}`);
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  if (options.httpOnly ?? true) {
    parts.push("HttpOnly");
  }

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (typeof cookieHeader !== "string" || cookieHeader.trim().length === 0) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, segment) => {
    const [rawName, ...rawValueParts] = segment.trim().split("=");
    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValueParts.join("="));
    return cookies;
  }, {});
}

export function readSessionToken(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[sessionCookieName];
  return typeof token === "string" && token.trim().length > 0 ? token : null;
}

export function setSessionCookie(res: Response, token: string) {
  res.append(
    "Set-Cookie",
    serializeCookie(sessionCookieName, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    }),
  );
}

export function clearSessionCookie(res: Response) {
  res.append(
    "Set-Cookie",
    serializeCookie(sessionCookieName, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    }),
  );
}

export function getRequestIpAddress(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]!.trim();
  }

  return req.socket.remoteAddress ?? "";
}

export function getRequestUserAgent(req: Request): string {
  return typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "";
}
