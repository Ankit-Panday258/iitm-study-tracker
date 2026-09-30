import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sqlite-api-plugin',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            const { handleApiRequest } = await import('./server/apiHandler.js');
            handleApiRequest(req, res, next);
          } catch (err) {
            next();
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            const { handleApiRequest } = await import('./server/apiHandler.js');
            handleApiRequest(req, res, next);
          } catch (err) {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  }
})
