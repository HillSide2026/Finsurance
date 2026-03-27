import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadEnvFile } from "./env";

test("loadEnvFile populates missing env values without overriding existing ones", async (t) => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "finsurance-env-"));
  const filePath = path.join(tempDir, ".env");

  t.after(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  await writeFile(
    filePath,
    [
      "# Stripe config",
      "STRIPE_SECRET_KEY=sk_test_from_file",
      "STRIPE_PRICE_ID=price_from_file",
      'APP_BASE_URL="https://example.com"',
    ].join("\n"),
    "utf8",
  );

  const env: NodeJS.ProcessEnv = {
    STRIPE_SECRET_KEY: "sk_test_existing",
  };

  loadEnvFile(filePath, env);

  assert.equal(env.STRIPE_SECRET_KEY, "sk_test_existing");
  assert.equal(env.STRIPE_PRICE_ID, "price_from_file");
  assert.equal(env.APP_BASE_URL, "https://example.com");
});
