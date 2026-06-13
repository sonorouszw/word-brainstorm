/**
 * Express 服务入口
 */
// 加载 .env（Vercel 部署时通过 Dashboard 设置环境变量，dotenv 不可用时跳过）
try { require('dotenv').config(); } catch (e) { /* dotenv not available */ }

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'storm123';

// 中间件
app.use(cors());
app.use(express.json());

// ===== 安全防护 =====

// 全局限流：每个 IP 每分钟最多 30 个请求
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: '请求太频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API 限流：每个 IP 每分钟最多 N 次 AI 调用
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 20,
  message: { error: 'AI 调用次数已达上限，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// ===== 密码验证 =====

// 验证密码的中间件
function passwordGate(req, res, next) {
  // 健康检查不需要密码
  if (req.path === '/api/health') return next();
  // 验证密码
  const userPassword = req.headers['x-access-password'] || req.query.password || '';
  if (userPassword === ACCESS_PASSWORD) return next();
  res.status(401).json({ error: '需要访问密码', needPassword: true });
}

// 密码验证接口
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  if (password === ACCESS_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: '密码错误' });
  }
});

// API 路由（密码 + 限流保护）
app.use('/api', passwordGate, apiLimiter, apiRouter);

// 托管前端构建产物
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// 健康检查（无需密码）
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.DEEPSEEK_API_KEY, hasPassword: !!ACCESS_PASSWORD });
});

// 导出 app 供 Vercel serverless 使用
module.exports = app;

// 只在直接运行时启动监听（本地开发），Vercel 导入时不执行
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 服务运行在 http://localhost:${PORT}`);
    console.log(`   🔑 访问密码: ${ACCESS_PASSWORD}`);
    console.log(`   🤖 API Key: ${process.env.DEEPSEEK_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`   🛡️  限流: ${process.env.RATE_LIMIT_MAX || 20} 次/分钟`);
  });
}
