var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var proxyTarget = (_a = process.env.VITE_GATEWAY_PROXY_TARGET) !== null && _a !== void 0 ? _a : 'http://localhost:8088';
var proxyDiagnosticsPlugin = function () { return ({
    name: 'api-proxy-diagnostics',
    configureServer: function (server) {
        var _a;
        server.middlewares.use(function (req, _res, next) {
            var _a;
            if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api/')) {
                server.config.logger.info("[dev-proxy] ".concat(req.method, " ").concat(req.url, " -> ").concat(proxyTarget), { timestamp: true });
            }
            next();
        });
        (_a = server.httpServer) === null || _a === void 0 ? void 0 : _a.once('listening', function () {
            server.config.logger.info("[dev-proxy] /api/* is proxied to ".concat(proxyTarget), { timestamp: true });
        });
    }
}); };
export default defineConfig({
    base: '/client/',
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
