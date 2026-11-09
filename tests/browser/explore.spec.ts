import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const at = (path: string) => `${process.env.PLAYWRIGHT_BASE_PATH ?? ""}${path}`;
async function choose(page: Page, text: string) {
  await page.getByRole("button", { name: text, exact: true }).click();
}
async function common(page: Page) {
  for (const text of [
    "有日常问候与适度交流",
    "先尝试，再讨论下一阶段",
    "每周可以安排一些固定时间",
    "优先保留独立安排，再协调",
  ])
    await choose(page, text);
}
test("four fictional directions complete with distinct branches and traceable wiki results", async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const scenarios = [
    { goal: "有人深聊、互相关心", branch: null, expect: "普通朋友" },
    {
      goal: "一起参加活动，轻松相处",
      branch: "跑步、健身或球类",
      expect: "跑步搭子",
    },
    {
      goal: "一起讨论或完成研究",
      branch: "一起研究、复核和写作",
      expect: "联合研究伙伴",
    },
  ];
  for (const scenario of scenarios) {
    await page.goto(at("/explore"));
    await choose(page, scenario.goal);
    if (scenario.branch) await choose(page, scenario.branch);
    await common(page);
    if (scenario.goal.includes("研究"))
      await choose(page, "仅为具体活动分摊或共享");
    await choose(page, "提前写清关键安排并定期复议");
    await expect(
      page.getByRole("heading", { name: "你的当前关系偏好报告", exact: true }),
    ).toBeVisible();
    await expect(
      page.locator(".recommendation-card").filter({ hasText: scenario.expect }),
    ).toBeVisible();
    expect(
      await page.locator(".recommendation-card").count(),
    ).toBeGreaterThanOrEqual(3);
    await page
      .locator(".recommendation-card details")
      .first()
      .locator("summary")
      .click();
    await expect(page.locator(".trace-list").first()).toContainText("你的回答");
  }
  await page.goto(at("/explore"));
  await choose(page, "探索长期恋爱与伴侣方向");
  await choose(page, "已满 18 岁，愿意继续");
  await choose(page, "希望能深聊生活和重要感受");
  await choose(page, "希望包含浪漫联结");
  await choose(page, "希望持续较长时间");
  await choose(page, "每周可以安排一些固定时间");
  await choose(page, "优先保留独立安排，再协调");
  await choose(page, "提前写清关键安排并定期复议");
  await choose(page, "不把性互动纳入这段关系");
  await choose(page, "暂不确定，先明确范围");
  await choose(page, "希望各自居住");
  await expect(
    page.getByRole("heading", { name: "你的当前关系偏好报告", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".recommendation-card").filter({ hasText: "长期恋情" }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  fs.mkdirSync("artifacts/screenshots", { recursive: true });
  await page.screenshot({
    path: `artifacts/screenshots/${info.project.name}-preference-report.png`,
    fullPage: true,
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `artifacts/screenshots/${info.project.name}-report-top.png`,
    fullPage: false,
  });
  await page
    .locator(".recommendation-card")
    .filter({ hasText: "长期恋情" })
    .getByRole("link", { name: "去 Wiki 阅读 ↗" })
    .click();
  await expect(
    page.getByRole("heading", { name: "长期恋情", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "深入阅读" })).toBeVisible();
});
test("hard unknown, age gate, contradiction, editing, denial and clearing remain usable", async ({
  page,
}) => {
  await page.goto(at("/explore"));
  await choose(page, "探索长期恋爱与伴侣方向");
  await choose(page, "不确认，略过成年人问题");
  await common(page);
  await choose(page, "保持口头沟通，变化时再确认");
  await expect(
    page.getByText("成年人分支未开启", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".recommendation-card")).toHaveCount(0);
  await choose(page, "修改主要方向");
  await choose(page, "一起讨论或完成研究");
  await expect(
    page.getByRole("heading", {
      name: "对方加入研究时，你最需要哪种协作？",
      exact: true,
    }),
  ).toBeVisible();
  await choose(page, "一起研究、复核和写作");
  await choose(page, "仅为具体活动分摊或共享");
  await expect(page.locator(".recommendation-card")).toHaveCount(4);
  const first = page.locator(".recommendation-card").first();
  const title = await first.locator("h4").innerText();
  await first.getByRole("button", { name: "这项不代表我" }).click();
  await expect(
    page.locator(".recommendation-card h4").filter({ hasText: title }),
  ).toHaveCount(0);
  await page.getByLabel("这些结论不能代表我，暂时否认本轮建议").check();
  await expect(page.locator(".recommendation-card")).toHaveCount(0);
  await page
    .getByLabel("我的补充与纠正（仅本页内存，不参与自动评分）")
    .fill("虚构测试：不每天回复。");
  await choose(page, "清空并重新探索");
  await expect(
    page.getByRole("heading", {
      name: "此刻，你最希望一段关系帮助你解决什么需要？",
      exact: true,
    }),
  ).toBeVisible();
  await choose(page, "探索长期恋爱与伴侣方向");
  await choose(page, "已满 18 岁，愿意继续");
  await choose(page, "希望能深聊生活和重要感受");
  await choose(page, "不希望包含浪漫联结");
  await choose(page, "查看当前结果（允许信息不足）");
  await expect(page.getByText("这些答案需要先澄清")).toBeVisible();
  await expect(page.locator(".recommendation-card")).toHaveCount(0);
  await page.getByRole("button", { name: "修改浪漫需求", exact: true }).click();
  await choose(page, "希望包含浪漫联结");
  await choose(page, "继续未完成的问题");
  await choose(page, "希望持续较长时间");
  await choose(page, "每周可以安排一些固定时间");
  await choose(page, "优先保留独立安排，再协调");
  await choose(page, "保持口头沟通，变化时再确认");
  await choose(page, "不确定");
  await page
    .getByLabel("这是本轮不可妥协的条件（模板未知时也不算满足）")
    .check();
  await choose(page, "希望讨论一对一排他安排");
  await choose(page, "希望各自居住");
  await expect(page.locator(".recommendation-card")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "必要属性未知 · 仅供待确认阅读" }),
  ).toBeVisible();
});
test("questionnaire is local, has no answer persistence, works at each viewport and unknown stays unknown", async ({
  page,
  baseURL,
}, info) => {
  const mutations: string[] = [],
    external: string[] = [],
    errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!["GET", "HEAD"].includes(r.method())) mutations.push(r.url());
    if (!r.url().startsWith(baseURL!)) external.push(r.url());
  });
  await page.goto(at("/explore"));
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
    path: `artifacts/screenshots/${info.project.name}-preference-question.png`,
    fullPage: true,
  });
  for (let i = 0; i < 6; i++)
    await choose(page, i === 1 ? "不适用" : i === 2 ? "不确定" : "跳过");
  await expect(
    page.getByText(
      "主要需要还不确定；目前不猜测关系类型。可以补充第一题，或继续保留未知。",
    ),
  ).toBeVisible();
  await expect(page.locator(".recommendation-card")).toHaveCount(0);
  await expect(page.locator(".preference-dimensions")).toContainText("不适用");
  await expect(page.locator(".preference-dimensions")).toContainText("不确定");
  await page
    .getByLabel("我的补充与纠正（仅本页内存，不参与自动评分）")
    .fill("Synthetic private note 123");
  expect(
    await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    })),
  ).toEqual({ local: [], session: [] });
  expect(page.url()).not.toContain("?");
  expect(page.url()).not.toContain("#");
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "此刻，你最希望一段关系帮助你解决什么需要？",
      exact: true,
    }),
  ).toBeVisible();
  expect(mutations).toEqual([]);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
test("coverage filters and readable evidence distinguish history from new definitions", async ({
  page,
}, info) => {
  await page.goto(at("/"));
  await page.getByRole("button", { name: "精细筛选" }).click();
  await page.getByLabel("内容建设状态", { exact: true }).selectOption("deep");
  await expect(page.locator("article.entry-card")).toHaveCount(20);
  await page
    .getByRole("searchbox", { name: "搜索关系", exact: true })
    .fill("联合研究伙伴");
  await page.locator(".card-link").click();
  await expect(
    page.getByRole("heading", { name: "联合研究伙伴", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "来源、证据与审核" }),
  ).toBeVisible();
  await expect(
    page.getByText("CRediT — Contributor Role Taxonomy, NISO ↗"),
  ).toBeVisible();
  await expect(page.getByText("未经独立审核", { exact: true })).toBeVisible();
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
    path: `artifacts/screenshots/${info.project.name}-deep-reading.png`,
    fullPage: false,
  });
});
