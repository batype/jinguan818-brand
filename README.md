# 金管818 品牌宣传网站

独立静态宣传站，介绍当前 App 的商城购物、会员社区、股权卡包和活动公告。无下载入口，不连接业务接口，不收集个人信息，不展示真实账户或订单。

## 本地预览

在当前目录执行 `python3 -m http.server 5191 --bind 127.0.0.1 --directory dist`，访问 `http://127.0.0.1:5191`。

## 内容与素材依据

- 商城购物与订单：`src/pages/shop/index.vue`、`src/pages/my/order/list/`。
- 社区成员与分享关系：`src/pages/my/invite/index.vue`，不包装成聊天、论坛功能。
- 会员服务：`src/pages/my/monthly-service/`，仅介绍开通、续费与有效期。
- 股权卡包：`src/pages/my/equity/index.vue` 与 `grouping.ts`，按现有分组保留鎏金、紫晶、青玉、星银风格，介绍编号、分组和整张转让，不承诺回报。
- 活动介绍：`src/pages/game/games/index.vue` 与 `src/pages/my/qwgp/index.vue`。仅介绍现有模块、规则入口和状态查看，不提供参与操作。
- `dist/assets/brand-mark.png`：App 品牌图片。
- `dist/assets/qijing-poster.png`：原样复制 `src/static/qijing.png`。嵌入为海报图片，不绑定加入等业务操作。
- 其余卡面与关系图由 HTML/CSS 绘制，是功能视觉示意，不是账户截图。

不介绍数字货币相关内容，不将尚未实现的生活缴费、出行或客服入口当作已上线能力。删除旧版无实际商品依据的生活用品配图与虚构底栏。页面存在功能不代表所有账户均可使用，使用条件以 App 为准。

## 维护与验证

`dist/index.html` 为文案与结构；`dist/styles.css` 为独立响应式样式；`dist/app.js` 提供卡面切换、功能场景、移动导航与 FAQ 交互。

运行 `node verify.mjs` 检查脚本语法、静态资源、锚点及内容边界。修改交互或布局后补充浏览器验证。

## 发布

仅本目录作为独立 Sites 项目，`.openai/hosting.json` 保留原站点身份和静态目录。保留站点现有访问范围，不修改 App 发布配置。

### GitHub Pages

GitHub 仓库：`https://github.com/batype/jinguan818-brand`。

部署工作流：`.github/workflows/pages.yml`。先在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**，再在 **Actions → Deploy GitHub Pages → Run workflow** 手动发布。

工作流先执行站点校验，再仅上传 `dist/` 的静态文件。分享地址会在临时发布目录中替换为 GitHub Pages 地址，不修改原 Sites 页面或其访问权限，不上传 `.openai/`、Git 元数据与其他源码文件。后续更新也手动运行同一工作流。

当前启用状态：GitHub API 返回 `422: Your current plan does not support GitHub Pages for this repository`。仓库保持私有；需要账号具备私有仓库 Pages 权限，或由所有者确认将宣传站仓库公开后才能启用。部署配置已准备，尚未产生可访问的 Pages 站点。
