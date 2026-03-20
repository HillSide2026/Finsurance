import assert from "node:assert/strict";
import test from "node:test";
import {
  buildApiErrorResponse,
  buildHealthResponse,
  parsePort,
  parsePositiveIntParam,
  resolveListenOptions,
  resolveServerHost,
} from "./http";

test("parsePositiveIntParam accepts safe positive integers", () => {
  assert.equal(parsePositiveIntParam("1"), 1);
  assert.equal(parsePositiveIntParam("42"), 42);
  assert.equal(parsePositiveIntParam("9007199254740991"), 9007199254740991);
});

test("parsePositiveIntParam rejects malformed ids", () => {
  assert.equal(parsePositiveIntParam(undefined), null);
  assert.equal(parsePositiveIntParam(""), null);
  assert.equal(parsePositiveIntParam("0"), null);
  assert.equal(parsePositiveIntParam("-7"), null);
  assert.equal(parsePositiveIntParam("3.14"), null);
  assert.equal(parsePositiveIntParam("12abc"), null);
  assert.equal(parsePositiveIntParam("abc12"), null);
  assert.equal(parsePositiveIntParam("9007199254740992"), null);
});

test("runtime helpers choose sane local and hosted listen settings", () => {
  assert.equal(resolveServerHost({}), "127.0.0.1");
  assert.equal(resolveServerHost({ REPL_ID: "demo" }), "0.0.0.0");
  assert.equal(resolveServerHost({ HOST: " 0.0.0.0 " }), "0.0.0.0");

  assert.equal(parsePort(undefined), 5000);
  assert.equal(parsePort("7000"), 7000);
  assert.equal(parsePort("invalid"), 5000);

  assert.deepEqual(resolveListenOptions({}), {
    host: "127.0.0.1",
    port: 5000,
  });
  assert.deepEqual(resolveListenOptions({ REPL_ID: "demo", PORT: "6001" }), {
    host: "0.0.0.0",
    port: 6001,
    reusePort: true,
  });
});

test("API payload helpers expose stable health and error shapes", () => {
  assert.deepEqual(buildHealthResponse(), {
    ok: true,
    mode: "client-first-mvp",
    product: "Finsurance",
  });

  assert.deepEqual(buildApiErrorResponse("API route not found.", "not_found"), {
    ok: false,
    error: {
      code: "not_found",
      message: "API route not found.",
    },
  });
});
