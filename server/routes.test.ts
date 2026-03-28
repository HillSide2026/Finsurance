import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("route integration flow protects auth, draft save-load, and billing confirmation", async () => {
  const integrationScriptPath = path.join(process.cwd(), "server", "routes.integration.ts");

  const result = await execFileAsync(
    process.execPath,
    ["--import", "tsx", integrationScriptPath],
    {
      cwd: process.cwd(),
      env: process.env,
    },
  );

  assert.equal(result.stderr.trim(), "");
});
