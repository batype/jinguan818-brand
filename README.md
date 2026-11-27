# 火炎焱公司官网

火炎焱多元化（广州）投资有限公司的独立静态官网。保留金属雕塑、鼠标视差、滚动反馈、明暗章节与静态回退。

## 公司文案：以用户最新逐字指令为准

`content/company-profile.txt` 以用户最初提供的 2949 字符原文为基准，按后续明确指令逐项改词。当前包含 2966 个字符（包括换行与空白），其中 65 个不换行空格。授权修改按时间顺序记录在 `content/company-copy-edits.json`。

原文基准 SHA-256：`8e1a11fa89c6742fe49cdddfd4d4e854a3f597b2e9c6404619c1d6febbdf18d8`。

2026-11-15 用户授权改词：导航“企业文化”改为“企业纲领”，标题、入口和原文标签“火炎焱文化”改为“火炎焱纲领”；正文的“中华民族文化”“传统文化”“慈善文化”等表述保持原样。2026-11-16 又按用户新指令将纲领正文中的同名条目恢复为“火炎焱文化：”，栏目标题与导航仍为纲领；同时精确修改产品与服务、公益、方向、定位、使命、宣言和寄语承诺。校验按修改记录逆序还原后，仍须匹配上述原始指纹。

当前确认文案 SHA-256：`8d25c87c443ed8f7a01ae234dccf3b44b1eabf30cc3f7271bf8c0c4b6c0cdf1d`。

- 完整展示公司概况、产品与服务、养老、公益、荣誉、领导致辞、纲领条目和寄语；寄语位于最新推荐之前。
- 除授权修改记录中的内容外，原文的特殊引号、标点、空格、数字、重复表述，以及“作事”等原始用字均保留。
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

`dist/index.html` 和原文文件已排除自动格式化，并禁用 Git 换行转换。后续改词应更新源文件并追加明确授权的替换记录，保留最初原文指纹及逆向校验，不得只调整校验值绕过差异。

纲领的十二个条目统一采用左侧标题、右侧正文；寄语结尾的四项承诺沿用同样布局。宣言每行两句，共四行；精神在电脑端每行四个词组，移动端（不超过 820px）每行三个词组。领导致辞的引句居中，引句到正文保留 18px 样式间距；原有缩进空白与引句末尾换行仅在视觉层隐藏，避免多占一行，文本源不删字。

火炎焱方向每行三个，共两行；核心价值观、火炎焱理念和火炎焱宗旨不按词组或句子强制换行，右栏全文随屏幕宽度自然折行。

纲领条目间距由样式控制，电脑端 22px、手机端 18px；原文空行保留在文本中但不额外占行。全部大章节标题（含最新推荐、最新动态）采用固定分档字号：电脑 24px、平板（不超过 820px）22px、手机（不超过 640px）20px，避免随 vw 持续增大。

章节标题与内容的间距统一使用 `--chapter-heading-gap`，沿用荣誉章节的分档值：电脑 32px、不超过 1120px 时 25px、手机（不超过 640px）24px。寄语和领导致辞标题后的原文换行保留在隐藏空白节点中，不额外占行；最新推荐不叠加正文顶部间距。

寄语结尾“我们一定会做到：”标题完整展示在一行，右侧四项承诺每项保留红色“♦”，每行两项，标题列按实际文字宽度占位。

## 最新推荐

“最新推荐”位于“寄语”之后、“最新动态”之前；导航可直接定位。`content/latest-recommendation.txt` 保留提供方的十条宣传文案，`content/recommendation-images.json` 保存八张图片的顺序、尺寸与 SHA-256。`render-recommendations.mjs` 随正文生成器一起执行。

八张原图存于 `dist/assets/recommendations/`，未重绘或裁切。电脑双列、手机单列，延迟加载图片；支持点击预览、上一张/下一张、方向键、Escape/关闭按钮/遮罩关闭，以及关闭后恢复焦点与页面滚动。无脚本时图片链接仍可直接打开原图。

文案与图片标为提供方宣传资料；按用户要求移除文案末尾的补充提示文字与“营养参考”链接。

## 最新动态

“最新动态”位于推荐图片区之后。`content/latest-updates.json` 按用户提供顺序保存两条文字、对应视频与封面，以及政策或报道原文链接；`render-updates.mjs` 随正文生成器执行。

视频位于 `dist/assets/updates/`，仅无损调整 MP4 容器索引至文件头，保留原有视频、音频、时长与画幅，不剪辑、不重编码。封面取自各视频第 2 秒。使用原生播放控件，支持内嵌和全屏观看；不自动播放，播放前不预加载视频，播放另一个视频或页面进入后台时暂停当前播放。

## 本地预览

`python3 -m http.server 5191 --bind 127.0.0.1 --directory dist`，访问 `http://127.0.0.1:5191`。无运行时依赖，无个人信息收集表单。

- `dist/app.js`：移动导航、章节揭示、阅读进度、指针反馈、动效暂停。
- `dist/sculpture.js`：本地 WebGL 金属雕塑，支持离屏停帧、减少动态效果和 SVG 回退。
- `dist/assets/guangzhou-skyline.jpg`：jo.sau 拍摄的广州城市实景，不代表公司办公地或资产。来源 [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Guangzhou_skyline.jpg)，[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)，网页以 CSS 作裁切和色调处理。页脚保留署名与许可链接。

## GitHub Pages

公开仓库：`https://github.com/batype/jinguan818-brand`。
官网地址：`https://batype.github.io/jinguan818-brand/`。

通过 **Actions → Deploy GitHub Pages → Run workflow** 发布。工作流只上传 `dist/`，并为静态资源添加版本标记。此前 Sites 项目身份保留，本次部署目标仍为 GitHub Pages。

## Docker 部署

在服务器克隆本仓库后，从仓库根目录构建并启动容器。镜像通过 Nginx 提供 `dist/` 中的网页、图片和视频。

```bash
git clone https://github.com/batype/jinguan818-brand.git
cd jinguan818-brand
docker build --pull -t jinguan818-brand:latest .
docker run -d --name jinguan818-brand --restart unless-stopped -p 8080:80 jinguan818-brand:latest
curl -f http://127.0.0.1:8080/
```

直接访问时使用服务器 IP 的 8080 端口。如果由同一台服务器上的 Nginx 或 Caddy 提供域名和 HTTPS，把端口映射改为 `-p 127.0.0.1:8080:80`，再将域名反向代理到 `http://127.0.0.1:8080`。
