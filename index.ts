import express from 'express';
import type { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = 9091;

const app = express();

app.use('/', createProxyMiddleware<Request, Response>({
  target: 'http://10.10.220.148:8081',
  changeOrigin: true,
  cookieDomainRewrite: '',
  headers: {
    Connection: 'keep-alive',
  },
  on: {
    proxyRes: (proxyRes, req, res) => {
      const url = req.url;
      const contentType = proxyRes.headers['content-type']?.toLocaleLowerCase().trim();
      if (contentType?.startsWith('text/html')) {
        // 强制浏览器缓存3小时
      } else if (url.includes('/api')) {
        // 强制不缓存
        proxyRes.headers['cache-control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        proxyRes.headers['pragma'] = 'no-cache';
        proxyRes.headers['expires'] = '0';
      } else {
        // 强制浏览器缓存一周
      }
    },
  },
}));

app.listen(PORT, () => {
  console.log(`service works on http://127.0.0.1:${PORT} ...`);
});
