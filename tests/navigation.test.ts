import assert from "node:assert/strict";
import test from "node:test";

import { getDefaultRouteForRole } from "../src/lib/navigation";

test("routes customers to the customer account area", () => {
  assert.equal(getDefaultRouteForRole("CUSTOMER"), "/account");
});

test("routes vendors to the vendor dashboard", () => {
  assert.equal(getDefaultRouteForRole("VENDOR"), "/vendor");
});

test("routes admins to the admin dashboard", () => {
  assert.equal(getDefaultRouteForRole("ADMIN"), "/admin");
});
