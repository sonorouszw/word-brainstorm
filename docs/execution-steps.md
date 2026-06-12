# 执行步骤 — 词语头脑风暴

## Phase 0 — 项目基础 ✅

- [x] 创建完整文件夹结构
- [x] 初始化 Vue 3 + Vite 前端
- [x] 初始化 Express 后端
- [x] 编写 docs/ 全部标准文档
- [x] 创建 devlog/ 及模板
- [x] 更新 CLAUDE.md
- [x] 创建 .gitignore

**验证**：`npm run dev` 启动空白 Vue 页面

---

## Phase 1 — 本地词典脑暴 MVP

- [ ] 编写 CC-CEDICT 预处理脚本
- [ ] 运行脚本生成 dictionary.json
- [ ] 实现 characterUtils.js（拆字、评分）
- [ ] 实现 useLocalDictionary composable
- [ ] 构建 WordInput 组件
- [ ] 构建 WordNode 组件
- [ ] 构建 BrainstormCanvas 组件
- [ ] 实现 useBrainstorm 核心状态管理
- [ ] 编写 main.css 基础样式
- [ ] 在 App.vue 中串联所有组件

**验证**：输入"月亮" → 显示 20 个关联词 → 点击展开 → 递归正常

---

## Phase 2 — AI 大模型集成

- [ ] 编写 server/services/llmService.js
- [ ] 编写 server/routes/api.js
- [ ] 更新 server/index.js
- [ ] 配置 frontend/vite.config.js 代理
- [ ] 构建 SourceSelector 组件（含利弊展示）
- [ ] 实现 useLLM composable
- [ ] 更新 useBrainstorm 支持双模式
- [ ] 更新 App.vue 集成 SourceSelector

**验证**：切换 AI 模式 → 输入 API Key → 语义结果正常 → 切回本地正常

---

## Phase 3 — 词语合并功能

- [ ] WordNode 多选功能
- [ ] 更新 useBrainstorm 添加选中状态
- [ ] 构建 MergePanel 组件
- [ ] 实现本地合并算法
- [ ] 实现 LLM 合并 API
- [ ] 构建 MergeResult 组件

**验证**：选"月亮"+"诗人" → 合并 → 创意结果 → 可继续扩展

---

## Phase 4 — 视觉打磨

- [ ] SVG 连线
- [ ] 展开/收起动画
- [ ] 响应式布局
- [ ] 色彩体系完善
- [ ] 首次使用引导

**验证**：整体美观、动画流畅、手机可用

---

## Phase 5 — 文档收尾

- [ ] 全文件中文化注释
- [ ] 更新全部 docs 文档
- [ ] 编写 mini-program-migration.md
- [ ] 最终走查

**验证**：新手可看文档跑起整个项目
