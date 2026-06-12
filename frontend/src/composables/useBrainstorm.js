/**
 * useBrainstorm — 核心状态管理（轨道导航模型）
 *
 * 管理：
 * - 导航历史栈（支持前进和后退）
 * - 当前中心词和关联词
 * - 加载状态
 *
 * 导航模型：
 *   history = [
 *     { centerWord: '月亮', relatedWords: [...] },
 *     { centerWord: '月光', relatedWords: [...] },
 *   ]
 *   currentIndex = 1  // 当前查看第几层
 */

import { ref, reactive, computed } from 'vue';

export function useBrainstorm(dictionaryService, llmService) {
  // ===== 状态 =====
  const history = ref([]);
  const currentIndex = ref(-1);
  const isLoading = ref(false);
  const isTransitioning = ref(false);
  const error = ref(null);
  const activeSource = ref('local'); // 'local' | 'llm'

  // ===== 计算属性 =====

  /** 当前中心词 */
  const centerWord = computed(() => {
    if (currentIndex.value < 0 || history.value.length === 0) return '';
    return history.value[currentIndex.value]?.centerWord || '';
  });

  /** 当前关联词列表 */
  const relatedWords = computed(() => {
    if (currentIndex.value < 0 || history.value.length === 0) return [];
    return history.value[currentIndex.value]?.relatedWords || [];
  });

  /** 面包屑路径 */
  const breadcrumbPath = computed(() => {
    return history.value.slice(0, currentIndex.value + 1).map((h) => ({
      word: h.centerWord,
    }));
  });

  /** 是否显示面包屑 */
  const showBreadcrumb = computed(() => breadcrumbPath.value.length > 1);

  // ===== 方法 =====

  /**
   * 根据当前模式查找关联词
   */
  async function _findRelated(word, excludeSet) {
    if (activeSource.value === 'llm' && llmService) {
      const results = await llmService.findRelated(word);
      return results.filter(r => !excludeSet.has(r.word));
    }
    return dictionaryService.findRelated(word, excludeSet);
  }

  /**
   * 提交新词作为起点（重置历史）
   */
  async function submitWord(word) {
    error.value = null;
    isLoading.value = true;
    isTransitioning.value = true;

    try {
      const results = await _findRelated(word, new Set([word]));
      history.value = [{ centerWord: word, relatedWords: results }];
      currentIndex.value = 0;
    } catch (err) {
      error.value = err.message || '查找关联词失败';
    } finally {
      isLoading.value = false;
      setTimeout(() => { isTransitioning.value = false; }, 100);
    }
  }

  /**
   * 点击关联词 → 以它为新中心展开
   */
  async function navigateToWord(wordObj) {
    error.value = null;
    isLoading.value = true;
    isTransitioning.value = true;

    try {
      // 收集需要排除的词（历史中的词 + 当前关联词中的词避免混淆）
      const excludeSet = new Set();
      excludeSet.add(wordObj.word);
      // 也排除祖先中心词
      for (const h of history.value) {
        excludeSet.add(h.centerWord);
      }

      const results = await _findRelated(wordObj.word, excludeSet);

      // 截断当前层级之后的历史，追加新层级
      const newHistory = history.value.slice(0, currentIndex.value + 1);
      newHistory.push({ centerWord: wordObj.word, relatedWords: results });
      history.value = newHistory;
      currentIndex.value = newHistory.length - 1;
    } catch (err) {
      error.value = err.message || '查找关联词失败';
    } finally {
      isLoading.value = false;
      setTimeout(() => { isTransitioning.value = false; }, 100);
    }
  }

  /**
   * 面包屑导航：回到指定层级
   * @param {number} index - 目标层级索引，-1 表示回到首页
   */
  function navigateToLevel(index) {
    if (index === -1) {
      // 回到首页 = 清空
      reset();
      return;
    }
    if (index >= 0 && index < history.value.length) {
      currentIndex.value = index;
    }
  }

  /**
   * 重置一切
   */
  function reset() {
    history.value = [];
    currentIndex.value = -1;
    error.value = null;
    isLoading.value = false;
    isTransitioning.value = false;
  }

  return {
    // 状态
    history,
    currentIndex,
    centerWord,
    relatedWords,
    breadcrumbPath,
    showBreadcrumb,
    isLoading,
    isTransitioning,
    error,
    activeSource,

    // 方法
    submitWord,
    navigateToWord,
    navigateToLevel,
    reset,
  };
}
