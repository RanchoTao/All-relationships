# GitHub Pages 发布与验证

本次在用户明确要求上传 GitHub 并配置 Pages 工作流后添加发布能力。此前 Phase 1 报告中的“未部署”是初次本地交付时的状态。

## 工作流

`.github/workflows/pages.yml` 在 `main` 推送、面向 `main` 的 PR 和手动触发时执行校验。PR 不发布；只有 `main` 上通过全部校验的构建可以部署 `github-pages` 环境。

流程为 `npm ci` → 数据验证 → 单元测试 → 类型检查 → Lint → 静态导出 → 安装 Chromium → 三视口 Playwright 测试 → 上传 Pages 产物 → 发布。部署任务仅有 `pages: write`、`id-token: write` 权限；构建任务只有仓库读取权限。失败时保留测试报告 14 天。

使用 GitHub Actions 作为 Pages 发布来源。读取到既有 Pages 地址为 `http://ranchotao.com/All-relationships/`；保留既有域名设置，不添加 CNAME 或修改其他仓库。

## 静态兼容

- `npm run build:pages` 生成 `out/` 和 `.nojekyll`，默认 `basePath` 为 `/All-relationships`，目录形式输出详情页。
- 比较与图谱通过客户端 `useSearchParams` 读取参数，并设有 Suspense 加载反馈；更新参数时保留仓库子路径。
- 479 个稳定 ID 全部预生成，不需要服务器、数据库或外部 API。
- `npm run preview:pages` 仅绑定本机 `127.0.0.1:3101`，以相同子路径提供实际静态文件。
- `npm run test:pages` 复用主要页面测试，并验证比较选择、图谱定位刷新后仍有效。浏览器测试访问的是真实导出目录，不是 Next.js 服务。

## 本地验证（2026-11-09）

静态导出、类型检查、Lint、479 项数据校验通过；7 项单元测试通过；静态站点浏览器测试 19 项通过、2 项重复 HTTP 路由检查跳过。479 个详情页均可访问，桌面／平板／手机视口覆盖页面的脚本错误、外部请求、整页横向溢出和 axe 违规均为 0。原始数据文件未修改。

线上发布结果以仓库 Actions 的运行记录及实际网站复核为准，不以本地测试代替远程部署状态。

## 维护参考

- [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)
- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
