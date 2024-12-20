import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import uno from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pages from 'vite-plugin-pages'
import layouts from 'vite-plugin-vue-layouts'
import components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_PATH,
    server: {
      port: 4001,
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
      layouts(),
      pages(),
      autoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/stores',
          'src/constants',
          'src/utils',
        ],
        vueTemplate: true,
      }),
      uno({
        presets: [
          presetAttributify(),
          presetUno(),
          presetIcons(),
        ],
      }),
      components({
        // resolvers: [AntDesignVueResolver()],
        resolvers: [],
        dts: 'src/components.d.ts',
      }),
    ],
  }
})
