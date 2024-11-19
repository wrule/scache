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
      if (url.includes('/api')) {
        proxyRes.headers['cache-control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        proxyRes.headers['pragma'] = 'no-cache';
        proxyRes.headers['expires'] = '0';
      } else {

      }
    },
  },
}));

app.listen(PORT, () => {
  console.log(`service works on http://127.0.0.1:${PORT} ...`);
});
