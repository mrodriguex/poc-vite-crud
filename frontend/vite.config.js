import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:3001';
  const devPort = parseInt(env.VITE_DEV_PORT, 10) || 5173;

  return {
    plugins: [react()],
    server: {
      port: devPort,
      proxy: {
        '/comps': backendUrl,
        '/health': backendUrl,
      },
    },
  };
});
