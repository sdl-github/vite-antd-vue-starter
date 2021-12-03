import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    // antd 按需加载
    ViteComponents({
      customComponentResolvers: [AntDesignVueResolver()],
    }),
  ],
});