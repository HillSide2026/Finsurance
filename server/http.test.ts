import assert from "node:assert/strict";
import test from "node:test";
import { parsePositiveIntParam } from "./http";

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
