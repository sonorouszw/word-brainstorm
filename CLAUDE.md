# CLAUDE.md

## 项目概述

**词语头脑风暴** — 帮助使用者通过「输入词 → 扩展关联词 → 连接合并」的流程，把模糊想法逐步清晰化的 Web 应用。

## 技术栈

- 前端：Vue 3 (Composition API) + Vite
- 后端：Node.js + Express（API 代理）
- 本地词典：CC-CEDICT（预处理）
- AI：Claude API / OpenAI API

## 项目文档

所有标准文档在 [docs/](docs/) 文件夹下：

| 文件 | 内容 |
|------|------|
| [docs/requirements.md](docs/requirements.md) | 需求文档 — 功能描述、用户场景 |
| [docs/tech-spec.md](docs/tech-spec.md) | 技术规范 — 架构、算法、API 设计 |
| [docs/design-spec.md](docs/design-spec.md) | 设计规范 — 色彩、布局、组件 |
| [docs/execution-steps.md](docs/execution-steps.md) | 执行步骤 — 分阶段任务清单 |
| [docs/mini-program-migration.md](docs/mini-program-migration.md) | 微信小程序迁移备忘 |

## 开发日志

每日开发日志在 [devlog/](devlog/) 文件夹下，按日期命名 `YYYY-MM-DD.md`。

每个开发会话结束时，助手应自动更新当天的 devlog 文件：
- 将完成的事项标记为 `[x]`
- 添加新完成的事项
- 更新「进行中」和「阻塞」
- 添加备注

## 启动项目

```bash
# 前端开发（端口 5173）
cd frontend && npm run dev

# 后端开发（端口 3000）
cd server && node index.js
```

## 代码约定

- **注释**：业务逻辑用中文注释，代码标识符（变量名、函数名）用英文
- **组件**：Vue 3 Composition API（`<script setup>`）
- **状态管理**：使用 Composables（`useXxx.js`），不使用 Pinia/Vuex
- **样式**：CSS 自定义属性定义色彩，写在 `src/styles/main.css`
- **简单优先**：不过度抽象，不引入不必要的库

## 工作流程

1. 查看 [docs/execution-steps.md](docs/execution-steps.md) 了解当前阶段
2. 每完成一个任务，更新 devlog
3. 每个 Phase 结束时：验证验收标准 → code-review → 确认无误后进入下一 Phase
4. 开发过程中优先调用已安装的 skills（code-review、test-driven-development、playwright-cli 等）

## 核心原则

- 用户是编程新手，代码要清晰、注释要充分
- 稳扎稳打，一个 Phase 一个 Phase 来
- 每个 Phase 有明确验证标准，通过再继续
- 不猜需求，不确定就问

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
