import { createHash } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";

const path = () => `${process.env.PLAYWRIGHT_BASE_PATH ?? ""}/compass/`;
const endpoint = "https://listings.invalid";
const mockSdk = `window.supabase = {
  createClient(url, key, options) {
    if (options.auth.persistSession || options.auth.autoRefreshToken || options.auth.detectSessionInUrl) {
      throw new Error("The listing client must remain anonymous");
    }
    return { from(table) {
      return { async insert(payload) {
        const response = await fetch(url + "/rest/v1/" + table, {
          method: "POST",
          headers: { apikey: key, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return { error: response.ok ? null : new Error("Test API rejected request") };
      } };
    } };
  },
};`;
const mockIntegrity = "sha384-" + createHash("sha384").update(mockSdk).digest("base64");

async function toResults(page: Page) {
  await page.goto(path());
  await expect(page.locator("#q h2")).toBeVisible();
  await expect(page.locator("#compass-listing")).toBeHidden();
  await page.getByRole("button", { name: /交朋友、有人懂我/ }).click();
  await page.getByRole("button", { name: "下一步", exact: true }).click();
  await page.locator("#toRes:visible, #toRes2:visible").first().click();
  await expect(page.locator("#results .rhead")).toBeVisible();
}

test("Compass answers and cards still work; an unconfigured listing cannot submit", async ({ page }) => {
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") submissions.push(request.url());
  });
  await toResults(page);
  const kept = page.locator("#stack .rc:not(.under):not(.under2) h2");
  const keptName = await kept.innerText();
  await page.getByRole("button", { name: "是这个", exact: true }).click();
  await expect(page.getByRole("button", { name: "移除 " + keptName })).toBeVisible();
  await page.getByRole("button", { name: "挂出我的需求", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("暂未开放提交。")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "确认挂出" })).toBeDisabled();
  await dialog.getByText("隐私说明", { exact: true }).click();
  await expect(dialog.getByText(/运营者邮箱，待填/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "移除 " + keptName })).toBeVisible();
  expect(submissions).toEqual([]);
});

test("listing takes ranked IDs and sends the minimum payload once", async ({ page }, info) => {
  await page.route("**/compass/listing.js", async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace('const SUPABASE_URL = "";', `const SUPABASE_URL = "${endpoint}";`)
      .replace('const SUPABASE_PUBLISHABLE_KEY = "";', 'const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";')
      .replace('const OPERATOR_EMAIL = "";', 'const OPERATOR_EMAIL = "operator@example.invalid";')
      .replace(/const SDK_INTEGRITY = "[^"]+";/, `const SDK_INTEGRITY = "${mockIntegrity}";`);
    await route.fulfill({ response, body });
  });
  await page.route("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@*/dist/umd/supabase.js", (route) =>
    route.fulfill({ contentType: "application/javascript", headers: { "access-control-allow-origin": "*" }, body: mockSdk }),
  );
  const requests: unknown[] = [];
  await page.route(endpoint + "/rest/v1/listings", async (route) => {
    const request = route.request();
    if (request.method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "POST", "access-control-allow-headers": "apikey,content-type" } });
    }
    expect(request.method()).toBe("POST");
    expect(request.headers().apikey).toBe("sb_publishable_test");
    requests.push(request.postDataJSON());
    await route.fulfill({ status: 201, headers: { "access-control-allow-origin": "*" } });
  });

  await toResults(page);
  const open = page.getByRole("button", { name: "挂出我的需求", exact: true });
  await open.click();
  const dialog = page.getByRole("dialog");
  const select = dialog.getByLabel("想优先建立的关系");
  const predicted = (await page.locator("#stack .rc h2").allTextContents()).reverse();
  expect(predicted.length).toBeGreaterThan(1);
  await expect(select.locator("option")).toHaveText(predicted);
  const ids = await select.locator("option").evaluateAll((list) => list.map((x) => (x as HTMLOptionElement).value));
  expect(ids.every((id) => /^A\d{2}-\d{3}$/.test(id))).toBe(true);
  await expect(select).toHaveValue(ids[0]);
  await select.selectOption(ids[1]);
  await dialog.getByLabel("城市").fill("测试市");
  await dialog.getByLabel("联系方式类型").selectOption("email");
  await dialog.locator("[name=contact]").fill("compass@example.invalid");
  await dialog.getByLabel("底线 1").fill("提前约时间");
  await dialog.getByLabel("公开描述").fill("偏好线上合作");
  const send = dialog.getByRole("button", { name: "确认挂出" });
  await send.click();
  await expect(dialog.getByText("请确认你已满 18 周岁。")).toBeVisible();
  await dialog.getByLabel("我已满 18 周岁").check();
  await send.click();
  await expect(dialog.getByText("请阅读并同意隐私说明。")).toBeVisible();
  await dialog.getByLabel("我已阅读并同意隐私说明").check();
  await dialog.locator("[name=city]").evaluate((el: HTMLInputElement) => { el.value = "长".repeat(31); });
  await send.click();
  await expect(dialog.getByText("城市不能超过 30 字。")).toBeVisible();
  await dialog.getByLabel("城市").fill("测试市");
  await dialog.locator("[name=company_website]").evaluate((el: HTMLInputElement) => { el.value = "bot"; });
  await send.click();
  expect(requests).toEqual([]);
  await dialog.locator("[name=company_website]").evaluate((el: HTMLInputElement) => { el.value = ""; });

  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  await dialog.screenshot({ path: `artifacts/screenshots/${info.project.name}-compass-listing.png` });
  await send.click();
  await expect(dialog.getByText(/已匿名挂出。/)).toBeVisible();
  expect(requests).toEqual([{
    relations: ids, primary_relation: ids[1], bottom_lines: ["提前约时间"], city: "测试市",
    contact_type: "email", contact: "compass@example.invalid", public_note: "偏好线上合作",
    consent: true, is_adult: true,
  }]);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain("compass@example.invalid");

  await page.reload();
  await open.click();
  await send.click();
  await expect(dialog.getByText(/请等待 \d+ 秒后再提交/)).toBeVisible();
  expect(requests).toHaveLength(1);
});
