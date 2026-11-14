# 火炎焱公司官网

火炎焱多元化（广州）投资有限公司的独立静态官网。保留金属雕塑、鼠标视差、滚动反馈、明暗章节与静态回退。

## 公司文案：以用户最新逐字指令为准

`content/company-profile.txt` 直接取自用户本次消息，去掉末尾的任务指令，未人工重录、未改写、未修正标点。包含 2949 个字符（包括换行与空白），其中 65 个不换行空格。

SHA-256：`8e1a11fa89c6742fe49cdddfd4d4e854a3f597b2e9c6404619c1d6febbdf18d8`。

- 完整展示公司概况、产品与服务、养老、公益、荣誉、领导致辞、文化条目和寄语，按原文顺序排列。
- 原文中特殊引号、逗号、顿号、空格、数字、重复表述，以及“作事”等原始用字均保留，不作编辑修正。
- 旧版经过概括的正文、六大领域改写介绍、简写领导致辞已替换。原文不折叠、不截断。
- 用户最新“一个字不能差”优先于早期删减范围；原文中的数字资产、货币等表述也照录，不沿用旧版过滤规则删去这些字句。
- 未额外增加经营资质、资产规模、荣誉或项目案例。导航、暂停按钮、图片署名等界面文字独立于原文。

## 编辑与校验

修改视觉结构时保留 `dist/index.html` 中的 `COMPANY_COPY_START/END` 边界。正文由 `render-verbatim.mjs` 依据唯一文本源自动生成，HTML 标签只用于版式，不插入或删除原文字符。

```bash
node render-verbatim.mjs
node verify.mjs
```

校验会检查：原文源文件指纹、生成内容、8 个正文块拼接后与原文逐字一致、资源与导航、JavaScript 语法。网页浏览器验收还会读取实际 DOM 的 `textContent` 与原文逐字比较，避免只检查源码却遗漏渲染层改字。

`dist/index.html` 和原文文件已排除自动格式化，并禁用 Git 换行转换。未来如用户提供新版本原文，应同时更新源文件与对应指纹，不得只调整校验值绕过差异。

## 本地预览

`python3 -m http.server 5191 --bind 127.0.0.1 --directory dist`，访问 `http://127.0.0.1:5191`。无运行时依赖，无个人信息收集表单。

- `dist/app.js`：移动导航、章节揭示、阅读进度、指针反馈、动效暂停。
- `dist/sculpture.js`：本地 WebGL 金属雕塑，支持离屏停帧、减少动态效果和 SVG 回退。
- `dist/assets/guangzhou-skyline.jpg`：jo.sau 拍摄的广州城市实景，不代表公司办公地或资产。来源 [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Guangzhou_skyline.jpg)，[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)，网页以 CSS 作裁切和色调处理。页脚保留署名与许可链接。

## GitHub Pages

公开仓库：`https://github.com/batype/jinguan818-brand`。
官网地址：`https://batype.github.io/jinguan818-brand/`。

通过 **Actions → Deploy GitHub Pages → Run workflow** 发布。工作流只上传 `dist/`，并为静态资源添加版本标记。此前 Sites 项目身份保留，本次部署目标仍为 GitHub Pages。
