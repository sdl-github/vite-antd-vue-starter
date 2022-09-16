import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const { mode } = env
  loadEnv(mode, process.cwd())
  return {
    server: {
      port: 3001
    },
    resolve: {
      // 路径别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
    ],
  }
});