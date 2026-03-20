import { z } from "zod";

function loadLocalEnvFile(path: string) {
  try {
    process.loadEnvFile(path);
  } catch (error) {
    const envError = error as NodeJS.ErrnoException;
    if (envError.code !== "ENOENT") {
      throw error;
    }
  }
}

loadLocalEnvFile(".env");

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
  REPL_ID: z.string().min(1, "REPL_ID is required"),
  AI_INTEGRATIONS_OPENAI_API_KEY: z
    .string()
    .min(1, "AI_INTEGRATIONS_OPENAI_API_KEY is required"),
  AI_INTEGRATIONS_OPENAI_BASE_URL: z.string().url().optional(),
  ISSUER_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = parsedEnv.data;
