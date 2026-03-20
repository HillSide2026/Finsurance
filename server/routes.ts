import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      mode: "client-first-mvp",
      product: "str-drafting-assistant",
    });
  });

  return httpServer;
}
