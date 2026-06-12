<script setup>
/**
 * SourceSelector — 双模式选择器
 *
 * 两个大卡片切换：本地离线模式 vs AI 智能模式
 * AI 模式选择时弹出广告占位（后期接真实广告）
 */

import { ref } from 'vue';

const props = defineProps({
  activeSource: { type: String, default: 'local' }, // 'local' | 'llm'
});

const emit = defineEmits(['update:activeSource']);

// 广告弹窗状态
const showAd = ref(false);
const adCanClose = ref(false);
let adTimer = null;

function selectSource(source) {
  if (source === 'llm') {
    // AI 模式：先弹广告
    showAd.value = true;
    adCanClose.value = false;

    // 3 秒后可关闭
    setTimeout(() => {
      adCanClose.value = true;
    }, 3000);
  } else {
    emit('update:activeSource', source);
  }
}

function closeAd() {
  if (!adCanClose.value) return;
  showAd.value = false;
  emit('update:activeSource', 'llm');
}

/** 来源识别 */
const MODES = [
  {
    key: 'local',
    icon: '📚',
    title: '本地词典',
    desc: '完全免费 · 离线可用',
    pros: ['✅ 完全免费', '✅ 无需联网', '✅ 即时响应'],
    cons: ['❌ 词汇量有限', '❌ 关联较基础'],
  },
  {
    key: 'llm',
    icon: '🧠',
    title: 'AI 智能',
    desc: '深度语义 · 创意丰富',
    pros: ['✅ 深度语义理解', '✅ 创意关联丰富', '✅ 支持词语合并'],
    cons: ['⚠️ 需看广告', '⚠️ 需要联网', '⚠️ 响应稍慢'],
  },
];
</script>

<template>
  <div class="source-selector">
    <div class="mode-cards">
      <div
        v-for="mode in MODES"
        :key="mode.key"
        class="mode-card"
        :class="{ active: activeSource === mode.key }"
        @click="selectSource(mode.key)"
      >
        <div class="mode-icon">{{ mode.icon }}</div>
        <div class="mode-title">{{ mode.title }}</div>
        <div class="mode-desc">{{ mode.desc }}</div>
        <ul class="mode-features">
          <li v-for="p in mode.pros" :key="p">{{ p }}</li>
          <li v-for="c in mode.cons" :key="c">{{ c }}</li>
        </ul>
        <div class="mode-check" v-if="activeSource === mode.key">✓ 当前</div>
      </div>
    </div>

    <!-- 广告弹窗 -->
    <div v-if="showAd" class="ad-overlay" @click.self="closeAd">
      <div class="ad-modal">
        <div class="ad-header">
          <span>📢 赞助广告</span>
          <button
            v-if="adCanClose"
            class="ad-close-btn"
            @click="closeAd"
          >
            {{ adCanClose ? '跳过广告 →' : `请等待 ${adCanClose ? 0 : ''} 秒` }}
          </button>
        </div>
        <div class="ad-content">
          <div class="ad-placeholder">
            <p>广告位招租</p>
            <small>联系投放：your-ad@example.com</small>
          </div>
        </div>
        <div class="ad-footer">
          <span v-if="!adCanClose" class="ad-timer">
            广告结束后可关闭（3秒）
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.source-selector {
  margin: 16px 0;
}

.mode-cards {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.mode-card {
  flex: 1;
  min-width: 220px;
  max-width: 300px;
  padding: 20px;
  border-radius: 14px;
  border: 2px solid var(--color-card-border);
  background: var(--color-card);
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  position: relative;
}

.mode-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--color-shadow);
}

.mode-card.active {
  border-color: var(--color-primary);
  background: #FFF9F0;
}

.mode-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.mode-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.mode-desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin-bottom: 12px;
}

.mode-features {
  list-style: none;
  padding: 0;
  text-align: left;
  font-size: 13px;
  line-height: 1.8;
}

.mode-check {
  margin-top: 12px;
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
}

/* 广告弹窗 */
.ad-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.ad-modal {
  background: white;
  border-radius: 16px;
  width: 400px;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.ad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #f8f8f8;
  font-size: 14px;
  font-weight: 600;
}

.ad-close-btn {
  background: var(--color-primary);
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.ad-content {
  padding: 40px 20px;
  text-align: center;
}

.ad-placeholder {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px;
  background: #fafafa;
}

.ad-placeholder p {
  font-size: 22px;
  font-weight: 700;
  color: #999;
  margin: 0 0 8px;
}

.ad-placeholder small {
  color: #bbb;
}

.ad-footer {
  padding: 10px 20px;
  text-align: center;
  font-size: 12px;
  color: #aaa;
}
</style>
