import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import { entries, displayName } from "../../src/lib/catalog";

const at = (path: string) => `${process.env.PLAYWRIGHT_BASE_PATH ?? ""}${path}`;

test("every original ID has a working detail route", async ({
  request,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Route coverage does not depend on viewport",
  );
  test.setTimeout(120000);
  for (let start = 0; start < entries.length; start += 12) {
    await Promise.all(
      entries.slice(start, start + 12).map(async (e) => {
        const response = await request.get(at(`/relationships/${e.id}`));
        expect(response.status(), e.id).toBe(200);
        const html = await response.text();
        expect(html, e.id).toContain(e.id);
        expect(html, e.id).toContain("未经独立审核");
        expect(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1], e.id).toContain(
          displayName(e),
        );
      }),
    );
  }
});

test("all 479 cards are reachable, category filters are faithful", async ({
  page,
}) => {
  await page.goto(at("/"));
  await expect(page.locator("article.entry-card")).toHaveCount(30);
  while (
    await page.getByRole("button", { name: "继续探索", exact: true }).count()
  ) {
    await page.getByRole("button", { name: "继续探索", exact: true }).click();
  }
  await expect(page.locator("article.entry-card")).toHaveCount(479);
  const ids = await page
    .locator("article.entry-card")
    .evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-entry-id")),
    );
  expect(new Set(ids).size).toBe(479);
  await page
    .getByRole("button", { name: "非浪漫友谊与深度情感伙伴 32", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("32");
  expect(
    await page
      .locator("article.entry-card")
      .evaluateAll((cards) =>
        cards.every((card) =>
          card.getAttribute("data-entry-id")?.startsWith("A04-"),
        ),
      ),
  ).toBeTruthy();
});
test("search, empty state, advanced filters and detail navigation", async ({
  page,
}) => {
  await page.goto(at("/"));
  await page
    .getByRole("searchbox", { name: "搜索关系", exact: true })
    .fill("FWB");
  await expect(page.locator("article.entry-card")).toHaveCount(1);
  await page.locator("article.entry-card .card-link").click();
  await expect(page).toHaveURL(/relationships\/A02-007/);
  await expect(
    page.getByRole("heading", { name: "有性关系的朋友", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".status-badge")).toContainText("未审核");
  await page.goto(at("/"));
  await page
    .getByRole("searchbox", { name: "搜索关系", exact: true })
    .fill("zzzz9999不存在");
  await expect(page.getByText("这片馆藏，暂时没有匹配项。")).toBeVisible();
  await page.getByRole("button", { name: "重置筛选" }).click();
  await page.getByRole("button", { name: "精细筛选" }).click();
  await page
    .getByLabel("资料审核状态", { exact: true })
    .selectOption("reviewed");
  await expect(page.locator("article.entry-card")).toHaveCount(0);
  await page
    .getByLabel("资料审核状态", { exact: true })
    .selectOption("working_draft");
  await expect(page.getByRole("status")).toContainText("71");
  await expect(page.locator("article.entry-card")).toHaveCount(30);
  await page.getByLabel("共同生活", { exact: true }).selectOption("涉及");
  await expect(page.locator("article.entry-card")).toHaveCount(4);
});
test("compare tray, limits, missing evidence and risk boundary", async ({
  page,
}) => {
  await page.goto(at("/"));
  await page
    .getByRole("button", { name: "加入比较：普通朋友", exact: true })
    .click();
  await page
    .getByRole("button", { name: "加入比较：长期恋情", exact: true })
    .click();
  await page
    .getByRole("button", { name: "加入比较：室友", exact: true })
    .click();
  await expect(
    page.getByText("已选两项。请先移除一项，再选择新的关系。"),
  ).toBeVisible();
  await page.getByRole("link", { name: "开始比较" }).click();
  await expect(page.getByRole("table")).toContainText("未知／未记录");
  await page
    .getByRole("button", { name: "普通朋友 / FWB", exact: true })
    .click();
  await expect(page.getByRole("table")).toContainText("可能涉及");
  await page.getByLabel("左侧关系", { exact: true }).selectOption("A17-025");
  expect(new URL(page.url()).pathname).toBe(
    at("/compare") + (process.env.PLAYWRIGHT_BASE_PATH ? "/" : ""),
  );
  await page.reload();
  await expect(page.getByLabel("左侧关系", { exact: true })).toHaveValue(
    "A17-025",
  );
  await expect(
    page.getByText(
      "选择中包含风险状态，仅供百科描述与风险研究；不生成协商或撮合模板。",
    ),
  ).toBeVisible();
});
test("graph is bounded, searchable and links to entries", async ({ page }) => {
  await page.goto(at("/graph"));
  await expect(page.locator(".react-flow__node").first()).toBeVisible();
  expect(await page.locator(".react-flow__node").count()).toBeLessThan(65);
  await page.getByRole("searchbox", { name: "图谱搜索" }).fill("三人伴侣");
  await page.getByRole("button", { name: /三人伴侣.*A03-025/ }).click();
  await expect(page.locator(".graph-selection")).toContainText("三人伴侣");
  expect(new URL(page.url()).pathname).toBe(
    at("/graph") + (process.env.PLAYWRIGHT_BASE_PATH ? "/" : ""),
  );
  await page.reload();
  await expect(page.locator(".graph-selection")).toContainText("三人伴侣");
  await page.getByRole("button", { name: "居中定位" }).click();
  await page.getByRole("link", { name: "阅读词条 ↗" }).click();
  await expect(page).toHaveURL(/relationships\/A03-025/);
  await page.goto(at("/graph"));
  await page.getByRole("button", { name: "20 个拟议原型族" }).click();
  await expect(page.locator(".react-flow__node")).toHaveCount(20);
  await page
    .locator(".react-flow__node")
    .filter({ hasText: "朋友 · 提议待审核" })
    .click();
  await page.getByRole("button", { name: "展开原稿归属词条" }).click();
  await expect(page.getByText(/虚线为原稿的未审核归属/)).toBeVisible();
});
test("primary pages have no page overflow, JS errors or axe violations", async ({
  page,
  browser,
  baseURL,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith(`${baseURL}/`))
      externalRequests.push(request.url());
  });
  fs.mkdirSync("artifacts/screenshots", { recursive: true });
  for (const [name, url] of [
    ["home", "/"],
    ["detail", "/relationships/A04-001"],
    ["missing", "/relationships/A01-001"],
    ["compare", "/compare"],
    ["graph", "/graph"],
    ["about", "/about"],
  ]) {
    await page.goto(at(url));
    if (name === "graph")
      await expect(page.locator(".react-flow__node").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      `${name} overflow`,
    ).toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await page.screenshot({
      path: `artifacts/screenshots/${info.project.name}-${name}.png`,
      fullPage: false,
    });
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      name,
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
  fs.writeFileSync(
    `artifacts/browser-${info.project.name}.json`,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        browser: browser.version(),
        viewport: page.viewportSize(),
        pages: 6,
        axeViolations: 0,
        pageErrors: 0,
        externalRequests: 0,
      },
      null,
      2,
    ),
  );
});
test("404 and reduced motion behave safely", async ({ page }) => {
  const response = await page.goto(at("/relationships/INVALID"));
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "返回全部馆藏" })).toBeVisible();
  await page.goto(at("/compare?left=constructor&right=__proto__"));
  await expect(page.getByRole("table")).toContainText("普通朋友");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(at("/"));
  expect(
    await page
      .locator(".entry-card")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "跳至主要内容" })).toBeFocused();
});
