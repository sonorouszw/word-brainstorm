<script setup>
/**
 * BreadcrumbNav — 面包屑导航组件
 *
 * 显示当前词路径层级，支持点击回到任意上层。
 * 例如：月亮 > 月光 > 光芒
 */

const props = defineProps({
  path: { type: Array, default: () => [] },
  // path = [{word: '月亮'}, {word: '月光'}, {word: '光芒'}]
});

const emit = defineEmits(['navigate']);
</script>

<template>
  <nav class="breadcrumb-nav" v-if="path.length > 0">
    <button class="breadcrumb-home" @click="$emit('navigate', -1)" title="回到首页">
      🏠
    </button>
    <template v-for="(item, index) in path" :key="index">
      <span class="breadcrumb-sep">›</span>
      <button
        class="breadcrumb-item"
        :class="{ 'is-current': index === path.length - 1 }"
        @click="$emit('navigate', index)"
        :disabled="index === path.length - 1"
      >
        {{ item.word }}
      </button>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.breadcrumb-home {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.breadcrumb-home:hover {
  background: var(--color-card-border);
}

.breadcrumb-sep {
  color: var(--color-text-lighter);
  font-size: 18px;
  user-select: none;
}

.breadcrumb-item {
  background: none;
  border: none;
  font-size: 15px;
  color: var(--color-primary);
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.breadcrumb-item:hover:not(:disabled) {
  background: rgba(224, 123, 57, 0.1);
}

.breadcrumb-item.is-current {
  color: var(--color-text);
  font-weight: 700;
  cursor: default;
}
</style>
