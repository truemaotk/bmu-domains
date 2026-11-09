# BMU 域名出售页

黑白响应式域名展示页，支持 8 种语言和 WhatsApp、邮件询价。默认展示 `bmu.cc`。访问 `/?domain=midu.uk` 时，首屏会切换到 `midu.uk`，询价内容也会带上该域名。

## 修改域名和联系方式

编辑 [`site.config.json`](site.config.json)。`primaryDomain` 是主站域名，也需要列在 `domains` 中。`domains` 按展示顺序排列，请填写小写域名，不带协议、路径或 `www`。`whatsapp` 使用带国家区号的国际号码。`email` 用于邮件询价。

页面结构、样式和交互在 [`src/`](src/) 中维护。构建后 `dist/index.html` 是可以单独打开的 HTML，`build/cloudflare-redirects.csv` 是可导入 Cloudflare 的重定向列表。

## 通过 GitHub 部署到 Cloudflare Workers

1. 在 **Workers & Pages → Create application** 中选择 **Continue with GitHub**，授权并选择本仓库及 `main` 分支。
2. Worker 名称填 `bmu-domains`，项目根目录使用仓库根目录，**Build command** 填 `npm run build`，**Deploy command** 填 `npx wrangler deploy`。仓库的 `wrangler.jsonc` 已声明 Worker 入口和静态资源。
3. 在部署生成的 `workers.dev` 地址验证页面。随后在 Worker 的 **Settings → Domains & Routes** 添加 **Custom Domain** `bmu.cc`。先确认 `bmu.cc` 已加入当前 Cloudflare 账户且区域为 Active。

[Workers Builds 配置](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) · [添加自定义域名](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

## 让待售域名跳转到 bmu.cc

可任选一种方式。

1. **在 Cloudflare 导入重定向表。** 运行 `npm run build` 生成 `build/cloudflare-redirects.csv`，在账户的 **Bulk Redirects** 创建列表并导入 CSV，再创建规则启用该列表。源主机名的 Web DNS 记录需要由 Cloudflare 代理。该方式也适用于直接上传的静态站点。 [Cloudflare 批量重定向操作](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-dashboard/)
2. **由 Worker 处理。** 在同一个 Worker 下，将要跳转的根域名和需要支持的 `www` 主机名分别添加为 **Custom Domain**。Worker 会对清单内的来源返回 `302`，例如 `https://midu.uk/` 跳转到 `https://bmu.cc/?domain=midu.uk`。`www.bmu.cc` 会转到 `bmu.cc`，保留路径和查询参数。 [Cloudflare 自定义域名匹配规则](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#request-matching-behaviour)

仓库部署只发布 Worker 和网页。绑定域名及启用重定向由你在 Cloudflare 完成。启用前可先确认哪些待售域名仍承载现有网站，因为规则覆盖这些主机名的全部网页路径。重定向采用 `302`，方便后续出售或调整时切换去向。

## 直接上传静态文件

使用 Cloudflare 创建页的 **Upload your static files**，上传 `dist/` 文件夹或将其中的 `index.html` 放在 ZIP 根目录后上传。部署后绑定 `bmu.cc`，其余域名使用上面的批量重定向方式。

## 本地开发

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

只生成 HTML 和 CSV 时执行 `npm run build`。在本机发布 Worker 时先执行 `npx wrangler login`，再执行 `npm run deploy`。

采用 [MIT 许可证](LICENSE)。
