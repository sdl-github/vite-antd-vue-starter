import { defineConfig, loadEnv } from 'vite';
import uno from 'unocss/vite'
import { presetAttributify, presetUno } from "unocss";
import presetIcons from '@unocss/preset-icons'
import vue from '@vitejs/plugin-vue';
import autoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig((env) => {
  const { mode } = env
  loadEnv(mode, process.cwd())
  return {
    server: {
      port: 4001
    },
    resolve: {
      // 路径别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      autoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/stores',
          'src/utils',
        ],
        vueTemplate: true,
      }),

      uno({
        presets: [
          presetAttributify(),
          presetUno(),
          presetIcons()
        ]
      }),
      components({
        resolvers: [AntDesignVueResolver()],
        dts: 'src/components.d.ts'
      })
    ],
  }
});