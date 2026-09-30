import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handleApiRequest } from './server/apiHandler.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sqlite-api-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          handleApiRequest(req, res, next);
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          handleApiRequest(req, res, next);
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  }
})
