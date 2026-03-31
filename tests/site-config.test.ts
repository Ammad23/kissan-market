import assert from "node:assert/strict";
import test from "node:test";

import { siteConfig } from "../src/lib/site";

test("supports both English and Urdu locales", () => {
  assert.deepEqual(siteConfig.locales, ["en", "ur"]);
});

test("keeps COD as a supported payment method", () => {
  assert.ok(siteConfig.paymentMethods.includes("cod"));
});
