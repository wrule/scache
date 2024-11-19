import express from 'express';
import type { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = 9091;
const TARGET = 'http://10.10.222.157:8081';

const app = express();

app.use('/', createProxyMiddleware<Request, Response>({
  target: TARGET,
  changeOrigin: true,
  cookieDomainRewrite: '',
  headers: {
    Connection: 'keep-alive',
  },
  on: {
    proxyRes: (proxyRes, req) => {
      const url = req.url;
      const contentType = proxyRes.headers['content-type']?.toLocaleLowerCase().trim();

      if (url.includes('/api')) {
        proxyRes.headers['cache-control'] = 'no-store';
      } else {
        const maxAge = contentType?.startsWith('text/html')
          ? 3 * 60 * 60
          : 7 * 24 * 60 * 60;
        proxyRes.headers['cache-control'] = `public, max-age=${maxAge}, immutable`;
      }

      delete proxyRes.headers['etag'];
      delete proxyRes.headers['last-modified'];
      delete proxyRes.headers['if-none-match'];
      delete proxyRes.headers['if-modified-since'];
      delete proxyRes.headers['pragma'];
    }
  },
}));

app.listen(PORT, () => {
  console.log(`service works on http://127.0.0.1:${PORT} ...`);
});
