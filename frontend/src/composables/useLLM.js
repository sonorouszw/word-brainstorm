/**
 * useLLM — AI 模式 Composable
 *
 * 通过后端代理调用 DeepSeek API 做词语联想和合并。
 */

import { ref } from 'vue';

// 获取存储的密码
function getPassword() {
  return sessionStorage.getItem('access_password') || '';
}

export function useLLM() {
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * AI 模式查找关联词
   */
  async function findRelated(word) {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch('/api/brainstorm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-password': getPassword(),
        },
        body: JSON.stringify({ word }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'AI 请求失败');
      }

      const data = await res.json();
      return data.results || [];
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * AI 模式合并词语
   * @param {string[]} words
   * @returns {object} {newWord, commonTheme, associations, creativeText}
   */
  async function mergeWords(words) {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch('/api/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-password': getPassword(),
        },
        body: JSON.stringify({ words }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '合并请求失败');
      }

      return await res.json();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return { findRelated, mergeWords, isLoading, error };
}
