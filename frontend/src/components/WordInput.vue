<script setup>
/**
 * WordInput — 词语输入组件
 *
 * 提供搜索输入框，支持回车提交。
 * 提示文字：「输入一个词来进行头脑风暴吧」
 */

import { ref } from 'vue';

const emit = defineEmits(['submit']);

const word = ref('');

function handleSubmit() {
  const trimmed = word.value.trim();
  if (!trimmed) return;
  emit('submit', trimmed);
  // 提交后不自动清空，让用户可以看到当前搜索词
}
</script>

<template>
  <div class="word-input">
    <div class="input-wrapper">
      <input
        v-model="word"
        type="text"
        class="input-field"
        placeholder="输入一个词来进行头脑风暴吧"
        @keyup.enter="handleSubmit"
        autofocus
      />
      <button class="submit-btn" @click="handleSubmit" :disabled="!word.trim()">
        探索
      </button>
    </div>
    <p class="input-hint">💡 输入一个词语，看看它会带你走向哪里</p>
  </div>
</template>

<style scoped>
.word-input {
  padding: 20px 0;
  text-align: center;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.input-field {
  flex: 1;
  padding: 14px 20px;
  font-size: 18px;
  border: 2px solid var(--color-card-border);
  border-radius: 12px;
  background: var(--color-card);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--color-primary);
}

.input-field::placeholder {
  color: var(--color-text-lighter);
}

.submit-btn {
  padding: 14px 28px;
  font-size: 18px;
  font-weight: 600;
  background: var(--color-primary);
  color: white;
  border-radius: 12px;
  transition: background 0.2s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-hint {
  margin-top: 10px;
  font-size: 13px;
  color: var(--color-text-light);
}
</style>
