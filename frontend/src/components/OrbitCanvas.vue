<script setup>
/**
 * OrbitCanvas — 轨道画布组件
 *
 * 核心视觉组件。负责：
 * 1. 计算圆形轨道上各节点的位置
 * 2. 渲染中心词 + 轨道关联词
 * 3. 管理切换动画
 */

import { ref, computed, watch } from 'vue';
import OrbitNode from './OrbitNode.vue';

const props = defineProps({
  centerWord: { type: String, default: '' },
  centerPinyin: { type: String, default: '' },
  centerDefinition: { type: String, default: '' },
  relatedWords: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  isTransitioning: { type: Boolean, default: false },
  activeSource: { type: String, default: 'local' },
});

const emit = defineEmits(['select-word']);

const canvasRef = ref(null);

// 画布尺寸（响应式）
const canvasSize = ref({ width: 800, height: 500 });

// 计算轨道半径（基于画布大小和词数）
const orbitRadius = computed(() => {
  const minDim = Math.min(canvasSize.value.width, canvasSize.value.height);
  const base = minDim * 0.32; // 轨道半径约为画布短边的 32%
  // 词多时轨道稍大
  const countFactor = Math.min(props.relatedWords.length / 10, 1.5);
  return Math.max(140, base * (1 + countFactor * 0.3));
});

// 为每个关联词计算角度
const positionedWords = computed(() => {
  const count = props.relatedWords.length;
  if (count === 0) return [];

  return props.relatedWords.map((word, i) => {
    // 从12点钟方向开始，均匀分布
    const angle = (360 / count) * i - 90;
    return {
      ...word,
      angle,
      index: i,
    };
  });
});

// 是否需要显示中心词
const hasCenter = computed(() => !!props.centerWord);

// 响应式监听窗口大小（由父组件传入或自行计算）
function updateSize() {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    canvasSize.value = {
      width: Math.max(rect.width, 400),
      height: Math.max(rect.height, 400),
    };
  }
}

// 暴露给父组件
defineExpose({ updateSize });
</script>

<template>
  <div class="orbit-canvas" ref="canvasRef">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="canvas-loading">
      <div class="loading-spinner"></div>
      <p>正在探索关联词...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!hasCenter && !isLoading" class="canvas-empty">
      <div class="empty-icon">🧠</div>
      <p class="empty-text">在上方输入一个词语，开始头脑风暴</p>
    </div>

    <!-- 轨道视图 -->
    <div v-else class="orbit-stage" :style="{ minHeight: canvasSize.height + 'px' }">
      <!-- 连接线（中心到每个轨道节点） -->
      <svg class="orbit-lines" :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`">
        <line
          v-for="(pw, i) in positionedWords"
          :key="'line-' + i"
          :x1="canvasSize.width / 2"
          :y1="canvasSize.height / 2"
          :x2="canvasSize.width / 2 + Math.cos(pw.angle * Math.PI / 180) * orbitRadius"
          :y2="canvasSize.height / 2 + Math.sin(pw.angle * Math.PI / 180) * orbitRadius"
          class="orbit-line"
          :style="{ animationDelay: 0.05 + (i / positionedWords.length) * 0.35 + 's' }"
        />
      </svg>

      <!-- 中心词 -->
      <OrbitNode
        v-if="hasCenter"
        :word="centerWord"
        :pinyin="centerPinyin"
        :definition="centerDefinition"
        :is-center="true"
        :key="'center-' + centerWord"
      />

      <!-- 轨道节点 -->
      <template v-if="!isTransitioning">
        <OrbitNode
          v-for="pw in positionedWords"
          :key="pw.id || pw.word"
          :word="pw.word"
          :pinyin="pw.pinyin"
          :definition="pw.definition"
          :is-center="false"
          :angle="pw.angle"
          :radius="orbitRadius"
          :index="pw.index"
          :total-count="positionedWords.length"
          @click="$emit('select-word', pw)"
        />
      </template>

      <!-- 淡色轨道圈（装饰） -->
      <div
        class="orbit-ring"
        :style="{
          width: orbitRadius * 2 + 'px',
          height: orbitRadius * 2 + 'px',
        }"
      ></div>

      <!-- 本地模式未收录提示 -->
      <div
        v-if="hasCenter && !isLoading && relatedWords.length === 0 && activeSource === 'local'"
        class="no-results-hint"
      >
        <p>📚 本地词典暂未收录「<strong>{{ centerWord }}</strong>」的语义关联</p>
        <p class="hint-sub">建议切换到 <strong>🧠 AI 智能模式</strong> 获得更精准的结果</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orbit-canvas {
  position: relative;
  width: 100%;
  min-height: 400px;
  background: radial-gradient(ellipse at center, #FFFBF0 0%, var(--color-bg) 70%);
  border-radius: 16px;
  overflow: hidden;
}

/* 空状态 & 加载状态 */
.canvas-empty,
.canvas-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--color-text-light);
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-light);
}

.canvas-loading .loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-card-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

.canvas-loading p {
  font-size: 14px;
  color: var(--color-text-light);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 轨道舞台 */
.orbit-stage {
  position: relative;
  width: 100%;
}

/* 连接线 */
.orbit-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.orbit-line {
  stroke: var(--color-card-border);
  stroke-width: 1;
  stroke-dasharray: 4 4;
  opacity: 0;
  animation: line-fade-in 0.5s ease forwards;
}

@keyframes line-fade-in {
  to { opacity: 0.5; }
}

/* 装饰轨道圈 */
.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px dashed var(--color-card-border);
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

/* 本地模式未收录提示 */
.no-results-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background: #FFF9F0;
  border: 1px solid #F0D5A8;
  border-radius: 12px;
  padding: 14px 24px;
  z-index: 3;
  animation: fade-in-up 0.4s ease;
}

.no-results-hint p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text);
}

.no-results-hint .hint-sub {
  font-size: 13px;
  color: var(--color-primary);
  margin-top: 6px;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
