import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { knowledgeById, coverage } from "../../src/lib/knowledge";
import fs from "node:fs";
const at = (path: string) => `${process.env.PLAYWRIGHT_BASE_PATH ?? ""}${path}`;

test("v0.4 summary, legacy fallback and coverage stay distinct", async ({
  page,
}) => {
  await page.goto(at("/"));
  const sample = knowledgeById["A04-001"];
  if (sample.schemaVersion !== "0.4") throw new Error("Missing sample");
  const current = page.locator('[data-entry-id="A04-001"]');
  await expect(current.locator(".card-link p")).toHaveText(sample.summary);
  const legacy = page.locator('[data-entry-id="A01-018"]');
  await expect(legacy.locator(".card-link p")).toHaveText(
    knowledgeById["A01-018"].definition,
  );
  await expect(legacy.locator(".badge")).toHaveText("待重写");
  await expect(page.locator(".draft-note")).toContainText(
    `旧版待重写 ${coverage.legacy} 张`,
  );
  await page.getByRole("button", { name: "精细筛选" }).click();
  await page
    .getByLabel("内容建设状态", { exact: true })
    .selectOption("complete");
  await expect(page.locator("article.entry-card")).toHaveCount(
    coverage.complete,
  );
  await page.getByLabel("内容建设状态", { exact: true }).selectOption("legacy");
  await expect(page.getByRole("status")).toContainText(String(coverage.legacy));
  await expect(page.locator('[data-entry-id="A04-001"]')).toHaveCount(0);
  await page.goto(at("/about"));
  await expect(
    page.getByText(
      new RegExp(`旧版待重写\\s*${coverage.legacy}\\s*张，不计入完成数量`),
    ),
  ).toBeVisible();
});

test("both detail variants render with accessible scenarios and negotiation lists", async ({
  page,
}, info) => {
  fs.mkdirSync("artifacts/screenshots", { recursive: true });
  await page.goto(at("/relationships/A04-001"));
  const sample = knowledgeById["A04-001"];
  if (sample.schemaVersion !== "0.4") throw new Error("Missing sample");
  await expect(
    page.getByRole("heading", { name: "普通朋友", exact: true }),
  ).toBeVisible();
  const mainSections = page.locator(".detail-layout > div > section > h2");
  await expect(mainSections.nth(0)).toHaveText("定义与适用范围");
  await expect(mainSections.nth(1)).toHaveText("它在生活中的样子 · 虚构情境");
  await expect(mainSections.nth(2)).toHaveText("通常需要说清的议题");
  await expect(mainSections.nth(3)).toHaveText("结构性的硬冲突");
  await expect(page.getByRole("heading", { name: /^情境 [123]$/ })).toHaveCount(
    3,
  );
  await expect(page.locator(".negotiables-list article")).toHaveCount(
    sample.negotiables.length,
  );
  await expect(
    page.getByText(sample.evidence.note, { exact: true }),
  ).toHaveCount(1);
  await expect(page.getByText("旧版内容待重写", { exact: false })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("link", { name: /Friendship — Stanford Encyclopedia/ }),
  ).toHaveAttribute("href", "https://plato.stanford.edu/entries/friendship/");
  await expect(
    page.getByRole("heading", { name: "关系如何变化" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "关联阅读" })).toBeVisible();
  await page
    .getByRole("heading", { name: "通常需要说清的议题" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `artifacts/screenshots/${info.project.name}-v04-negotiables.png`,
  });
  for (const route of ["/relationships/A04-001", "/relationships/A01-018"]) {
    await page.goto(at(route));
    if (route.endsWith("A01-018")) {
      await expect(page.locator(".status-badge")).toContainText("待重写");
      await expect(page.getByText(/旧版内容待重写：保留原稿/)).toBeVisible();
      await expect(page.locator(".negotiables-list")).toHaveCount(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/screenshots/${info.project.name}-${route.endsWith("A04-001") ? "v04" : "legacy"}-detail.png`,
    });
  }
});
