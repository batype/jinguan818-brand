# 火炎焱公司官网

火炎焱多元化（广州）投资有限公司的独立静态官网。以公司品牌、科技驱动、多元产业布局和社会责任为主体，取代此前金管818 App 产品宣传内容。

## 内容依据与表达

依据用户于 2026-11-14 提供的公司介绍、业务方向、企业文化、领导致辞与寄语整理。

- 立足广州、技术研发、线上线下结合、客户利益至上来自公司资料。
- 六大布局是对原始业务方向的编辑归类：科技与产业投资、供应链与商贸、健康与养老、能源与出行、实业与资产配置、文化与专业服务。
- 未来的养老、生物科技、公益重点、集团化与国际化以关注方向或愿景表述，不写成已完成项目。
- 原资料中的荣誉均为争取目标，不制作获奖墙，不虚构规模、排名、投资项目、资质、客户或管理资产数据。
- 沿用用户要求：不展示数字货币相关内容，不设置 App 下载入口。删去原 App 卡包、游戏和支付功能演示。
- 未提供公开电话、邮箱、详细地址和领导姓名，页面不虚构这些资料，也不设置无后端的咨询表单。
- 头部标记与金属雕塑为品牌概念视觉，不声称是注册商标或实际投资项目。雕塑由本地 WebGL 着色器实时绘制，支持鼠标与滚动响应、暂停、离屏停帧、减少动态效果和静态 SVG 回退。无外部运行时依赖。

## 本地预览与维护

在本目录执行 `python3 -m http.server 5191 --bind 127.0.0.1 --directory dist`，访问 `http://127.0.0.1:5191`。

- `dist/index.html`：公司文案、页面结构与内联科技视觉。
- `dist/styles.css`：曜石黑、暖银与朱砂橙的明暗章节布局、滚动入场、产业转场及减少动态效果支持。
- `dist/app.js`：六大布局切换、键盘操作、移动导航、滚动进度、章节揭示、指针反馈与动效暂停。
- `dist/sculpture.js`：本地金属扭环着色器，帧率与像素数限制、可见性暂停、静态回退。
- `dist/assets/guangzhou-skyline.jpg`：jo.sau 拍摄的广州实景，仅作为城市影像，不代表公司办公地或资产。原始来源 [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Guangzhou_skyline.jpg)，[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)，网页以 CSS 作裁切与色调处理。页面页脚也保留署名、来源和许可链接。
- `dist/assets/huoyanyan-mark.svg`：官网文字品牌旁的视觉标记。
- `dist/assets/company-share.svg`：公司官网分享图。
- `verify.mjs`：脚本语法、静态资源、内部锚点、内容边界检查。

执行 `node verify.mjs`。布局与交互变更还需浏览器检查，至少覆盖桌面、平板和手机。

## GitHub Pages

保留现有公开仓库 `https://github.com/batype/jinguan818-brand` 和站点地址 `https://batype.github.io/jinguan818-brand/`，不因页面品牌调整自动重命名仓库。

在 **Actions → Deploy GitHub Pages → Run workflow** 手动发布。工作流仅上传静态文件，不上传 Git 元数据或 `.openai/`。`.openai/hosting.json` 保留此前 Sites 项目身份，但本次发布目标为用户已选定的 GitHub Pages，不修改原 Sites 访问设置。
