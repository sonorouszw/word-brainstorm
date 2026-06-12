# 技术规范 — 词语头脑风暴

## 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 前端框架 | Vue 3 (Composition API) | 学习曲线平缓，中文生态好 |
| 构建工具 | Vite | 秒级热更新，零配置起步 |
| 后端 | Node.js + Express | 仅做 API 代理，~50 行代码 |
| 本地词典 | CC-CEDICT | 开源中文词典，12 万词条 |
| AI API | Claude API / OpenAI API | 语义联想与创意合并 |
| 状态管理 | Vue Composables | 单页应用无需 Pinia |

## 架构图

```
[浏览器] <---> [Vite Dev Server :5173] --proxy--> [LLM API]
                     |
                     | (生产构建)
                     v
              [Express Server :3000]
              |-- 提供静态文件 (dist/)
              |-- /api/brainstorm  --> Claude/OpenAI
              |-- /api/merge       --> Claude/OpenAI
              |-- /api/dictionary  --> 本地 JSON
```

## 本地关联算法

1. **拆字**：输入词拆分为汉字字符（如 "月光" → ["月", "光"]）
2. **倒排索引**：预建的 汉字→含该字的词列表 映射
3. **候选收集**：收集所有包含至少一个共享字的词
4. **评分排序**：
   - 每共享一个字 +3 分
   - 共享字位置相同 +2 分
   - 额外共享字 +1 分/个
5. **去重**：排除输入词本身和已展示的祖先词
6. **返回**：取前 20 个结果

## AI 提示词设计

### 关联词生成
```
你是一个汉语词语联想助手。给定一个汉语词语，请返回20个与其语义最相关的汉语词语。
要求：
- 返回纯JSON数组，不要包含markdown代码块标记
- 每个元素是一个对象：{"word": "词语", "pinyin": "ci2 yu3", "definition": "简要释义"}
- 词语应为现代汉语常用词
- 优先返回语义相关度高的词语
输入词语：{word}
```

### 词语合并
```
你是一个汉语创意联想助手。给定2-5个汉语词语，请将它们有机结合，生成创意内容。
要求：
- 返回纯JSON对象，不要包含markdown代码块标记
- 包含字段：newWord, commonTheme, associations(5个), creativeText(100字内)
输入词语：{words}
```

## API 设计

### POST /api/brainstorm
- Body: `{ word: string, provider: "claude" | "openai" }`
- Response: `{ results: [{word, pinyin, definition}] }`

### POST /api/merge
- Body: `{ words: string[], provider: "claude" | "openai" }`
- Response: `{ newWord, commonTheme, associations, creativeText }`

## 数据文件

- `dictionary.json`：预处理后的词典数组，约 2 万条
- `charIndex.json`：汉字倒排索引

## 浏览器兼容

- 支持现代浏览器（Chrome, Firefox, Safari, Edge 最新两个版本）
- 不兼容 IE
