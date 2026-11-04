# Carmind 公司介绍网站

Carmind 的多语言公司介绍网站，使用 React 和 Vite 构建。支持中文、英语、阿拉伯语和俄语，阿拉伯语采用从右到左布局。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
```

访问终端显示的本地地址；预览服务需要保持运行。生产构建使用 `npm run build`，输出在 `dist/`。

## 项目结构

- `src/main.jsx`：业务数据和翻译内容。
- `src/SiteApp.jsx`、`src/site.css`：主页面和样式。
- `src/OnlineModel.jsx`、`public/reference-online/`：“四个在线”图表及其本地资源。图表以同源 iframe 嵌入；部署时请允许同源嵌入。
- `src/trainingContent.js`：培训内容。
- `public/media/`：网站图片和其他静态素材。
- `netlify.toml`：Netlify 构建及安全响应头设置。

维修站三维图为效果示意，并非工程施工图。其下设备清单用于说明方案配置，与效果图中的设备不作逐一对应。

## 部署

当前网站部署在 Netlify。构建命令为 `npm run build`，发布目录为 `dist`。网站与仓库尚未设置自动部署；GitHub 权限与 Netlify 部署权限分别管理。部署前请确认目标站点和访问权限，不要更改现有访问设置。

`netlify.toml` 的 `SAMEORIGIN` 响应头允许本网站嵌入“四个在线”图表；其他部署平台需要配置等效规则。`public/reference-online/` 还包含图表点击后使用的内容及图片，修改或公开分享前请检查其中的业务信息。

## 验证

`npm run build` 用于检查生产构建。仓库包含历史的 `check:site` 和 `check:artifacts` 脚本，其断言基于旧版页面及旧单文件导出流程，可能需要适配当前设计后才能作为验收依据。`share:html` 生成的单 HTML 文件尚不能独立打包“四个在线”iframe，请使用正常构建和部署流程。
