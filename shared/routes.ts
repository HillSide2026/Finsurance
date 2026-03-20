import { z } from "zod";
import { chats, messages, ndas } from "./schema";
import { intakeReadinessSchema, ndaIntakePatchSchema } from "./nda-intake";

const chatDetailsResponseSchema = z.object({
  chat: z.custom<typeof chats.$inferSelect>(),
  messages: z.array(z.custom<typeof messages.$inferSelect>()),
  readiness: intakeReadinessSchema,
});

const chatIntakeResponseSchema = z.object({
  chat: z.custom<typeof chats.$inferSelect>(),
  readiness: intakeReadinessSchema,
});

export const api = {
  auth: {
    // Auth is handled by Replit Auth middleware, but we might want status
    status: {
      method: "GET" as const,
      path: "/api/auth/user",
      responses: {
        200: z.object({ user: z.any().optional() }), // Relaxed type for now
      },
    },
  },
  chats: {
    create: {
      method: "POST" as const,
      path: "/api/chats",
      input: z.object({
        title: z.string().trim().min(1).max(120).optional(),
      }),
      responses: {
        201: z.custom<typeof chats.$inferSelect>(),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/chats",
      responses: {
        200: z.array(z.custom<typeof chats.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/chats/:id",
      responses: {
        200: chatDetailsResponseSchema,
        404: z.object({ message: z.string() }),
      },
    },
    updateIntake: {
      method: "PATCH" as const,
      path: "/api/chats/:id/intake",
      input: ndaIntakePatchSchema,
      responses: {
        200: chatIntakeResponseSchema,
        404: z.object({ message: z.string() }),
      },
    },
    sendMessage: {
      method: "POST" as const,
      path: "/api/chats/:id/messages",
      input: z.object({
        content: z.string().trim().min(1).max(4000),
      }),
      responses: {
        201: z.object({
          userMessage: z.custom<typeof messages.$inferSelect>(),
          assistantMessage: z.custom<typeof messages.$inferSelect>(),
        }),
      },
    },
  },
  ndas: {
    generate: {
      method: "POST" as const,
      path: "/api/ndas",
      input: z.object({
        chatId: z.number().int().positive(),
        answers: ndaIntakePatchSchema.optional(),
      }),
      responses: {
        201: z.custom<typeof ndas.$inferSelect>(),
      },
    },
    getLatestForChat: {
      method: "GET" as const,
      path: "/api/chats/:id/nda",
      responses: {
        200: z.custom<typeof ndas.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/ndas/:id",
      responses: {
        200: z.custom<typeof ndas.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
