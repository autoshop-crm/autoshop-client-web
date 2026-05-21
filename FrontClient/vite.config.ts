import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

const proxyTarget = process.env.VITE_GATEWAY_PROXY_TARGET ?? 'http://localhost:8088';

const proxyDiagnosticsPlugin = (): Plugin => ({
  name: 'api-proxy-diagnostics',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req, _res, next) => {
      if (req.url?.startsWith('/api/')) {
        server.config.logger.info(`[dev-proxy] ${req.method} ${req.url} -> ${proxyTarget}`, { timestamp: true });
      }
      next();
    });

    server.httpServer?.once('listening', () => {
      server.config.logger.info(`[dev-proxy] /api/* is proxied to ${proxyTarget}`, { timestamp: true });
    });
  }
});

export default defineConfig({
  plugins: [react(), proxyDiagnosticsPlugin()],
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false
      }
    }
  }
});
