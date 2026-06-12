/**
 * 本地词典 Composable
 *
 * 负责加载词典数据，并提供基于共享汉字匹配的词关联查找。
 * 词典数据异步加载（fetch），并在内存中缓存以供后续调用。
 */

import { ref, reactive } from 'vue';
import { findRelatedWords } from '../utils/characterUtils.js';

// 模块级缓存 — 只加载一次
let cachedDictionary = null;
let cachedCharIndex = null;
let cachedSemanticMap = null;

export function useLocalDictionary() {
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * 加载所有数据（词典 + 索引 + 语义图谱）
   */
  async function ensureDictionary() {
    if (cachedDictionary && cachedCharIndex && cachedSemanticMap) return;

    if (isLoading.value) {
      while (isLoading.value) {
        await new Promise((r) => setTimeout(r, 100));
      }
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const [dictRes, indexRes, semanticRes] = await Promise.all([
        fetch('/src/data/dictionary.json'),
        fetch('/src/data/charIndex.json'),
        fetch('/src/data/semanticMap.json'),
      ]);

      if (!dictRes.ok || !indexRes.ok) {
        throw new Error('词典文件加载失败');
      }

      cachedDictionary = await dictRes.json();
      cachedCharIndex = await indexRes.json();
      // 语义图谱可能不存在（开发中），优雅降级
      cachedSemanticMap = semanticRes.ok ? await semanticRes.json() : {};

      console.log(`📚 词典：${cachedDictionary.length}词 | 语义图谱：${Object.keys(cachedSemanticMap).length}个话题 | 汉字：${Object.keys(cachedCharIndex).length}个`);
    } catch (err) {
      error.value = err.message;
      console.error('数据加载失败:', err);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 查找关联词：仅从语义图谱查找，不做字符匹配回退
   * 不在图谱中的词返回空数组
   */
  async function findRelated(word, excludeWords = new Set()) {
    await ensureDictionary();

    if (error.value) throw new Error(error.value);

    // 只从语义图谱查找
    if (cachedSemanticMap && cachedSemanticMap[word]) {
      const semanticWords = cachedSemanticMap[word]
        .filter((w) => !excludeWords.has(w))
        .slice(0, 20);
      if (semanticWords.length > 0) {
        console.log(`🎯 语义图谱命中："${word}" → ${semanticWords.length}个关联词`);
        return semanticWords.map((w) => ({
          word: w,
          pinyin: '',
          definition: '语义关联',
        }));
      }
    }

    // 不在语义图谱中 → 返回空，不做字符匹配
    console.log(`❓ 语义图谱未收录："${word}"，建议切换AI模式`);
    return [];
  }

  return {
    isLoading,
    error,
    ensureDictionary,
    findRelated,
  };
}
