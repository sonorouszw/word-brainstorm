/**
 * Vercel Serverless Function 入口
 * 导入 Express 应用，供 Vercel 自动处理 HTTP 请求
 */
const app = require('../server/index.js');
module.exports = app;
