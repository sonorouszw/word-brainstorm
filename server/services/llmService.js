/**
 * LLM 服务 — 封装 DeepSeek API 调用
 *
 * 后期可扩展：Claude、OpenAI、豆包、DeepSeek 免费 API
 * 切换只需修改 model 和 endpoint
 */

// DeepSeek API 配置（后期可改为豆包等）
const LLM_CONFIG = {
  endpoint: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
};

/**
 * 调用大模型生成关联词
 * @param {string} word - 输入词语
 * @returns {array} [{word, pinyin, definition}]
 */
async function brainstormWord(word) {
  if (!LLM_CONFIG.apiKey) {
    throw new Error('API Key 未配置，请在 server/.env 中设置 DEEPSEEK_API_KEY');
  }

  const systemPrompt = `你是汉语词语联想专家。给定一个词，列出与它语义最相关的20个词语。
这些词语应该是人们在生活中自然联想到的、有真实关联的词（不只是字面相似）。
比如"电影院"应该联想到"爆米花、可乐、IMAX、电影票"等，而不是"医院"。

要求：
- 返回纯JSON对象：{"words": ["词1", "词2", ...]}
- 不要包含markdown代码块标记
- 词语为2-4字现代汉语常用词`;

  const response = await fetch(LLM_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: LLM_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请列出与"${word}"语义相关的20个词语。` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('API 返回内容为空');
  }

  // 解析 JSON 响应
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    // 尝试从 markdown 代码块中提取
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      parsed = JSON.parse(match[1]);
    } else {
      throw new Error('无法解析 API 返回的 JSON');
    }
  }

  // 转换为统一格式 {word, pinyin, definition}
  const words = parsed.words || [];
  return words.map((w) => ({
    word: w,
    pinyin: '',
    definition: 'AI 生成',
  }));
}

/**
 * 调用大模型合并多个词语
 * @param {string[]} words - 要合并的词语列表
 * @returns {{newWord, commonTheme, associations, creativeText}}
 */
async function mergeWords(words) {
  if (!LLM_CONFIG.apiKey) {
    throw new Error('API Key 未配置');
  }

  const wordList = words.join('、');
  const systemPrompt = `你是汉语创意联想专家。给定几个词，将它们有机结合生成创意内容。

返回纯JSON对象格式：
{
  "newWord": "创造性的新词或短语（可能不存在则为空字符串）",
  "commonTheme": "这些词之间的共同主题（一句话）",
  "associations": ["关联词1", "关联词2", "关联词3", "关联词4", "关联词5"],
  "creativeText": "一段100字以内的创意文字，串联所有输入词"
}`;

  const response = await fetch(LLM_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: LLM_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请将以下词语合并联想：${wordList}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      parsed = JSON.parse(match[1]);
    } else {
      throw new Error('无法解析 API 返回的 JSON');
    }
  }

  return parsed;
}

module.exports = { brainstormWord, mergeWords };
