<script setup>
/**
 * PasswordGate — 访问密码门禁
 *
 * 在进入应用前要求输入密码，密码正确后存入 sessionStorage。
 * 后续所有 API 请求自动携带密码。
 */

import { ref, onMounted } from 'vue';

const emit = defineEmits(['unlocked']);

const password = ref('');
const error = ref('');
const loading = ref(true);

// 检查是否已经解锁过
onMounted(() => {
  const saved = sessionStorage.getItem('access_password');
  if (saved) {
    // 验证密码是否仍然有效
    verifyPassword(saved);
  } else {
    loading.value = false;
  }
});

async function verifyPassword(pwd) {
  try {
    const res = await fetch('/api/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) {
      sessionStorage.setItem('access_password', pwd);
      emit('unlocked', pwd);
    } else {
      sessionStorage.removeItem('access_password');
      loading.value = false;
      error.value = '密码已失效，请重新输入';
    }
  } catch {
    loading.value = false;
  }
}

async function handleSubmit() {
  const pwd = password.value.trim();
  if (!pwd) return;

  error.value = '';
  loading.value = true;

  try {
    const res = await fetch('/api/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) {
      sessionStorage.setItem('access_password', pwd);
      emit('unlocked', pwd);
    } else {
      error.value = '密码错误，请重试';
    }
  } catch {
    error.value = '网络错误，请检查连接';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="password-gate">
    <div class="gate-card">
      <div class="gate-icon">🔐</div>
      <h2>词语头脑风暴</h2>
      <p class="gate-desc">此应用仅限朋友间分享使用<br>请输入访问密码</p>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="password"
          type="password"
          class="gate-input"
          placeholder="输入密码"
          autofocus
          :disabled="loading"
        />
        <button type="submit" class="gate-btn" :disabled="loading || !password.trim()">
          {{ loading ? '验证中...' : '进入' }}
        </button>
      </form>
      <p v-if="error" class="gate-error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.password-gate {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.gate-card {
  background: white;
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  max-width: 360px;
  width: 90%;
}

.gate-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.gate-card h2 {
  font-size: 22px;
  color: var(--color-text);
  margin: 0 0 8px;
}

.gate-desc {
  font-size: 14px;
  color: var(--color-text-light);
  margin: 0 0 24px;
  line-height: 1.6;
}

.gate-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid var(--color-card-border);
  border-radius: 10px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.gate-input:focus {
  border-color: var(--color-primary);
}

.gate-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  background: var(--color-primary);
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.gate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gate-error {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-danger);
}
</style>
