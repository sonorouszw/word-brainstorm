<script setup>
/**
 * App.vue — 词语头脑风暴 根组件
 *
 * 串联：SourceSelector → WordInput → BreadcrumbNav → OrbitCanvas
 * 支持本地词典和 AI 双模式
 */

import { ref, onMounted, watch } from 'vue';
import WordInput from './components/WordInput.vue';
import BreadcrumbNav from './components/BreadcrumbNav.vue';
import OrbitCanvas from './components/OrbitCanvas.vue';
import SourceSelector from './components/SourceSelector.vue';
import PasswordGate from './components/PasswordGate.vue';
import { useLocalDictionary } from './composables/useLocalDictionary.js';
import { useLLM } from './composables/useLLM.js';
import { useBrainstorm } from './composables/useBrainstorm.js';

// 密码门状态
const unlocked = ref(false);

// 初始化服务
const dictionary = useLocalDictionary();
const llm = useLLM();

// 初始化核心状态（传入两个服务）
const brainstorm = useBrainstorm(dictionary, llm);

// 处理模式切换
function handleSourceChange(source) {
  brainstorm.activeSource.value = source;
}

// 预加载词典
onMounted(async () => {
  try {
    await dictionary.ensureDictionary();
    console.log('📚 词典就绪');
  } catch (err) {
    console.error('词典加载失败:', err);
  }
});

// 处理新词提交
async function handleWordSubmit(word) {
  await brainstorm.submitWord(word);
}

// 处理点击关联词
async function handleSelectWord(wordObj) {
  await brainstorm.navigateToWord(wordObj);
}

// 处理面包屑导航
function handleBreadcrumbNavigate(index) {
  brainstorm.navigateToLevel(index);
}
</script>

<template>
  <!-- 密码门 -->
  <PasswordGate v-if="!unlocked" @unlocked="unlocked = true" />

  <!-- 主应用 -->
  <div class="app" v-else>
    <header class="app-header">
      <h1>🧠 词语头脑风暴</h1>
      <p class="app-subtitle">把模糊的想法，一步步变清晰</p>
    </header>

    <main class="app-main">
      <!-- 模式选择器 -->
      <SourceSelector
        :active-source="brainstorm.activeSource.value"
        @update:active-source="handleSourceChange"
      />

      <!-- 输入框 -->
      <WordInput @submit="handleWordSubmit" />

      <!-- 面包屑导航 -->
      <BreadcrumbNav
        :path="brainstorm.breadcrumbPath.value"
        @navigate="handleBreadcrumbNavigate"
      />

      <!-- 错误提示 -->
      <div v-if="brainstorm.error.value" class="error-banner">
        ⚠️ {{ brainstorm.error.value }}
        <button @click="brainstorm.error.value = null">✕</button>
      </div>

      <!-- 轨道画布 -->
      <OrbitCanvas
        :center-word="brainstorm.centerWord.value"
        :related-words="brainstorm.relatedWords.value"
        :is-loading="brainstorm.isLoading.value"
        :is-transitioning="brainstorm.isTransitioning.value"
        :active-source="brainstorm.activeSource.value"
        @select-word="handleSelectWord"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-bg);
}

.app-header {
  text-align: center;
  padding: 30px 20px 10px;
}

.app-header h1 {
  font-size: 28px;
  color: var(--color-text);
  margin: 0 0 6px;
}

.app-subtitle {
  font-size: 14px;
  color: var(--color-text-light);
  margin: 0;
}

.app-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

/* 错误横幅 */
.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin: 10px 0;
  background: #FFF0F0;
  border: 1px solid #FFD0D0;
  border-radius: 10px;
  color: #C0392B;
  font-size: 14px;
}

.error-banner button {
  background: none;
  border: none;
  color: #C0392B;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
}
</style>
