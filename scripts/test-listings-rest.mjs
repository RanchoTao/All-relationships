#!/usr/bin/env node
// Synthetic only. Apply supabase/listings.sql to a disposable database first.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = new URL(process.env.LISTINGS_TEST_URL ?? "");
const key = process.env.LISTINGS_TEST_PUBLISHABLE_KEY;
const local = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
if (url.username || url.password || url.search || url.hash) throw new Error("Use a bare REST base URL.");
if (!local && (process.env.LISTINGS_TEST_DISPOSABLE_PROJECT !== "yes" ||
    url.protocol !== "https:" || !/^sb_publishable_[\w-]+$/.test(key ?? ""))) {
  throw new Error("Hosted test requires a disposable project, HTTPS, and a publishable key.");
}
const rest = url.href.replace(/\/$/, "") + "/listings";
const payload = {
  relations: ["A04-001", "A05-001", "A09-004"],
  primary_relation: "A04-001",
  bottom_lines: ["仅为测试，提前约时间", "每次约完确认下次"],
  city: "测试市",
  public_note: "合成验收记录",
  contact_type: "email",
  contact: "compass-test-" + randomUUID() + "@example.invalid",
  is_adult: true,
  consent: true,
};
async function request(method, { body, query = "", prefer = "return=minimal" } = {}) {
  return fetch(rest + query, {
    method,
    headers: {
      ...(key ? { apikey: key } : {}),
      ...(body ? { "content-type": "application/json" } : {}),
      prefer,
    },
    body: body && JSON.stringify(body),
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
}
function denied(response, name) {
  assert.ok([400, 401, 403].includes(response.status), `${name}: HTTP ${response.status}`);
  console.log(`PASS ${name}: HTTP ${response.status}`);
}
const valid = await request("POST", { body: payload });
assert.equal(valid.status, 201, `Valid insert: ${await valid.text()}`);
console.log(`PASS insert: 201; confirm then remove synthetic row for ${payload.contact}`);
const read = await request("GET", { query: "?select=contact" });
if (read.ok) {
  assert.deepEqual(await read.json(), []);
  console.log("PASS anonymous read: zero rows");
} else denied(read, "anonymous read");
const query = "?contact=eq." + encodeURIComponent(payload.contact);
denied(await request("PATCH", { query, body: { public_note: "改写" } }), "anonymous update");
denied(await request("DELETE", { query }), "anonymous delete");
denied(await request("POST", { body: payload, prefer: "return=representation" }), "insert returning data");

for (const [name, patch] of [
  ["no consent", { consent: false }],
  ["not an adult", { is_adult: false }],
  ["non-new status", { status: "matched" }],
  ["forged admin note", { admin_note: "x" }],
  ["forged creation time", { created_at: new Date().toISOString() }],
  ["forged match link", { matched_with: randomUUID() }],
  ["too many bottom lines", { bottom_lines: ["甲", "乙", "丙"] }],
  ["bottom line 61 characters", { bottom_lines: ["甲".repeat(61)] }],
  ["null bottom line", { bottom_lines: [null] }],
  ["city 31 characters", { city: "城".repeat(31) }],
  ["note 81 characters", { public_note: "文".repeat(81) }],
  ["contact 101 characters", { contact: "a".repeat(101) }],
  ["invalid contact type", { contact_type: "postal" }],
  ["empty relations", { relations: [] }],
  ["invalid relation ID", { relations: ["fake"], primary_relation: "fake" }],
  ["primary outside chosen IDs", { primary_relation: "A11-001" }],
]) {
  denied(await request("POST", { body: { ...payload, ...patch } }), name);
}
