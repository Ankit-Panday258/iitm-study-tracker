import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'study-api-plugin',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            // Vite serves the frontend and API on the same development origin.
            req.appOrigin = `http://${req.headers.host}`;
            const { handleApiRequest } = await import('./server/apiHandler.js');
            handleApiRequest(req, res, next);
          } catch (err) {
            if (!req.url.startsWith('/api/')) return next();
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Backend unavailable. Check server configuration.' }));
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            // Vite serves the frontend and API on the same development origin.
            req.appOrigin = `http://${req.headers.host}`;
            const { handleApiRequest } = await import('./server/apiHandler.js');
            handleApiRequest(req, res, next);
          } catch (err) {
            if (!req.url.startsWith('/api/')) return next();
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Backend unavailable. Check server configuration.' }));
          }
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})
