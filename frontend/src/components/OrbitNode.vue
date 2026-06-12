<script setup>
/**
 * OrbitNode — 轨道节点组件
 *
 * 圆形卡片，展示一个词语。支持：
 * - 中心模式（大圆）和轨道模式（小圆）
 * - 悬停放大动画
 * - 错开入场动画
 */

import { computed } from 'vue';

const props = defineProps({
  word: { type: String, required: true },
  pinyin: { type: String, default: '' },
  definition: { type: String, default: '' },
  isCenter: { type: Boolean, default: false },  // 是否为中心词
  angle: { type: Number, default: 0 },           // 在轨道上的角度（度）
  radius: { type: Number, default: 0 },           // 轨道半径（px）
  index: { type: Number, default: 0 },            // 序号（用于错开动画）
  totalCount: { type: Number, default: 10 },      // 总数（用于动画延迟计算）
});

const emit = defineEmits(['click']);

// 计算在画布上的位置
const position = computed(() => {
  if (props.isCenter) {
    return { x: 0, y: 0 }; // 中心，由父组件定位
  }
  const rad = (props.angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * props.radius,
    y: Math.sin(rad) * props.radius,
  };
});

// 入场动画延迟（从中心向外扩散）
const enterDelay = computed(() => {
  if (props.isCenter) return 0;
  // 错开：第一个词 50ms，最后一个词 400ms
  return 0.05 + (props.index / Math.max(props.totalCount, 1)) * 0.35;
});
</script>

<template>
  <div
    class="orbit-node"
    :class="{ 'is-center': isCenter, 'is-orbiting': !isCenter }"
    :style="{
      '--x': position.x + 'px',
      '--y': position.y + 'px',
      '--enter-delay': enterDelay + 's',
    }"
    @click="$emit('click')"
    :title="definition"
  >
    <div class="node-inner">
      <span class="node-word">{{ word }}</span>
      <span class="node-pinyin" v-if="pinyin && isCenter">{{ pinyin }}</span>
    </div>
  </div>
</template>

<style scoped>
.orbit-node {
  position: absolute;
  /* 默认在中心，通过 transform 移动到轨道位置 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translate(var(--x), var(--y));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  z-index: 2;

  /* 入场动画 */
  animation: node-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: var(--enter-delay);
}

@keyframes node-enter {
  from {
    opacity: 0;
    /* 从中心位置弹出到轨道位置 的效果通过初始 scale(0) 实现 */
  }
  to {
    opacity: 1;
  }
}

/* 轨道节点从中心弹出 */
.orbit-node.is-orbiting {
  animation: orbit-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: var(--enter-delay);
}

@keyframes orbit-pop {
  from {
    opacity: 0;
    /* 从中心(0,0)位置开始弹出 */
    transform: translate(-50%, -50%) scale(0.3);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(1);
  }
}

.node-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-card);
  border: 2px solid var(--color-card-border);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;

  /* 轨道节点默认大小 */
  width: 80px;
  height: 80px;
}

/* 中心节点更大 */
.is-center .node-inner {
  width: 140px;
  height: 140px;
  border-color: var(--color-primary);
  border-width: 3px;
  box-shadow: 0 4px 24px rgba(224, 123, 57, 0.18);
  z-index: 10;
}

/* 悬停效果：放大 */
.orbit-node:hover .node-inner {
  border-color: var(--color-primary);
  box-shadow: 0 6px 20px rgba(224, 123, 57, 0.2);
}

.is-orbiting:hover .node-inner {
  transform: scale(1.18);
}

.is-center:hover .node-inner {
  transform: scale(1.06);
}

.node-word {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
  padding: 4px;
}

.is-center .node-word {
  font-size: 22px;
}

.node-pinyin {
  font-size: 11px;
  color: var(--color-text-light);
  margin-top: 2px;
}
</style>
