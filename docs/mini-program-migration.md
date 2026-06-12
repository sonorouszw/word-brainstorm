# 微信小程序迁移备忘 — 词语头脑风暴

## 迁移路径

推荐使用 **uni-app** 框架将 Vue 3 Web 应用迁移到微信小程序。

## Vue 3 → uni-app 映射关系

| Web (Vue 3) | uni-app |
|-------------|---------|
| `.vue` 单文件组件 | 直接复用（template/style/script 结构相同） |
| `<div>` | `<view>` |
| `<span>`, `<p>` | `<text>` |
| `<img>` | `<image>` |
| `<input>` | `<input>`（属性有差异） |
| `fetch()` / `axios` | `uni.request()` |
| `localStorage` | `uni.setStorageSync()` / `uni.getStorageSync()` |
| CSS `position: fixed` | 在 scroll-view 内不可用 |
| SVG 动画 | 不支持，改用 CSS 动画 |
| Vue Router | uni-app 内置路由（pages.json） |

## 迁移步骤

1. 安装 HBuilderX 或 uni-app CLI
2. 创建 uni-app 项目
3. 将 `frontend/src/components/` 下的 `.vue` 文件复制到 uni-app 项目
4. 替换 HTML 标签（div→view, span→text 等）
5. 将 composables 复制到 uni-app 项目
6. 修改 API 调用：`fetch` → `uni.request`
7. 修改本地存储：`localStorage` → `uni.setStorageSync`
8. 词典数据改为静态导入而非 fetch
9. 在 `pages.json` 中配置页面路由
10. 使用微信开发者工具调试

## 注意事项

- 微信小程序包体积限制 2MB（主包）+ 分包，词典数据需要拆分或云端化
- 小程序不支持直接调用第三方 API（需后端代理，我们已有 Express 后端）
- CSS 不支持 `vh`/`vw` 单位的部分场景，改用 `rpx`
- 动画性能在低端机上需测试

## 时间预估

熟悉 uni-app 的开发者约 2-3 天可完成迁移。
