/**
 * 汉字工具函数
 *
 * 用于词语拆分、共享字匹配和关联度评分。
 */

/**
 * 将词语拆分为不重复的汉字数组
 * "月光" → ["月", "光"]
 */
export function splitCharacters(word) {
  const chars = [];
  for (const ch of word) {
    if (!chars.includes(ch)) {
      chars.push(ch);
    }
  }
  return chars;
}

/**
 * 根据共享汉字查找关联词语并评分
 *
 * @param {string} word - 输入词语
 * @param {object} charIndex - 倒排索引 { 字: [词ID列表] }
 * @param {array} dictionary - 词典数组 [{word, pinyin, definition}]
 * @param {Set} excludeSet - 需要排除的词集合（输入词本身 + 祖先词）
 * @param {number} limit - 返回数量上限，默认 20
 * @returns {array} 关联词数组 [{word, pinyin, definition, score}]
 */
export function findRelatedWords(word, charIndex, dictionary, excludeSet, limit = 20) {
  const chars = splitCharacters(word);
  const candidateScores = {}; // { wordIndex: score }

  for (let ci = 0; ci < chars.length; ci++) {
    const ch = chars[ci];
    const indices = charIndex[ch];
    if (!indices) continue;

    for (const idx of indices) {
      const entry = dictionary[idx];

      // 排除输入词本身和祖先词
      if (excludeSet.has(entry.word)) continue;

      // 评分
      let score = candidateScores[idx] || 0;

      // 基础分：共享一个汉字 +3
      score += 3;

      // 位置分：共享字在相同位置 +2
      if (entry.word.indexOf(ch) === ci) {
        score += 2;
      }

      // 额外共享字：除了当前字外还有更多共享字 +1/个
      // （这个检查在首次遇到时做一次就够了）
      if (score === 3) {
        // 第一次给这个词打分，检查所有共享字
        let sharedCount = 0;
        for (const c of chars) {
          if (entry.word.includes(c)) sharedCount++;
        }
        if (sharedCount > 1) {
          score += (sharedCount - 1); // 额外共享字各+1
        }
      }

      candidateScores[idx] = score;
    }
  }

  // 按分数降序排序，取前 limit 个
  const sorted = Object.entries(candidateScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([idx, score]) => ({
      ...dictionary[parseInt(idx)],
      score,
    }));

  return sorted;
}
