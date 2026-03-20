import type { Express } from "express";
import type { Server } from "http";
import { buildApiErrorResponse, buildHealthResponse } from "./http";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json(buildHealthResponse());
  });

  app.use("/api", (_req, res) => {
    res.status(404).json(buildApiErrorResponse("API route not found.", "not_found"));
  });

  return httpServer;
}
