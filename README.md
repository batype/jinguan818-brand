# 金管818 品牌宣传网站

独立、无构建依赖的静态宣传站。仅介绍精选商城、商品收藏、订单与售后、个人中心及会员服务。不设下载入口，不连接 App 业务接口，不使用真实用户或订单数据。

## 本地预览

在当前目录执行 `python3 -m http.server 5191 --directory dist`，访问 `http://127.0.0.1:5191`。直接打开 `dist/index.html` 也可以查看。

## 内容维护

- `dist/index.html`：品牌文案、各展示区域、服务指南。
- `dist/styles.css`：独立的响应式视觉样式，不影响 App 主题。
- `dist/app.js`：手机端导航、三种功能演示、演示收藏、演示深浅色、FAQ。
- `dist/assets/brand-mark.png`：来自当前 App 的品牌图片。
- `dist/assets/lifestyle-editorial.png`：生成的生活场景配图，不代表实际商品或库存。

界面为网站内的本地演示，收藏状态只保存在当前页面内存，不关联 App 账户，不产生订单、不收集个人信息。

## 配图来源

生活场景图使用内置 ImageGen 生成。提示词：温暖奶油色背景中的陶瓷杯、花瓶、橄榄枝、亚麻布与棕色随行包，柔和自然日光、哑光材质、克制的生活方式杂志摄影，无文字、无商标。原图由输出目录复制至 `dist/assets/lifestyle-editorial.png`。

## 发布

仅当前目录作为独立 Sites 项目，`.openai/hosting.json` 关联同一站点。发布默认保留私密可见范围；不自动更改访问权限或 App 发布配置。
