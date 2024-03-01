// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/vite@5.0.0-beta.12_@types+node@20.2.3_sass@1.69.5/node_modules/vite/dist/node/index.js";
import Vue from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/@vitejs+plugin-vue@4.4.0_vite@5.0.0-beta.12_vue@3.3.7/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/vite-plugin-pages@0.31.0_vite@5.0.0-beta.12/node_modules/vite-plugin-pages/dist/index.mjs";
import Layouts from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/vite-plugin-vue-layouts@0.8.0_vite@5.0.0-beta.12_vue-router@4.2.5_vue@3.3.7/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@4.1.4_vue@3.3.7/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/unplugin-auto-import@0.16.7_@vueuse+core@10.5.0_rollup@4.1.4/node_modules/unplugin-auto-import/dist/vite.js";
import VueMacros from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/unplugin-vue-macros@2.6.1_@vueuse+core@10.5.0_rollup@4.1.4_typescript@5.2.2_vite@5.0.0-beta.12_vue@3.3.7/node_modules/unplugin-vue-macros/dist/vite.mjs";
import VueDevTools from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/vite-plugin-vue-devtools@1.0.0-rc.5_pug@3.0.2_rollup@4.1.4_vite@5.0.0-beta.12/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import Unocss from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/unocss@0.57.1_postcss@8.4.31_rollup@4.1.4_vite@5.0.0-beta.12/node_modules/unocss/dist/vite.mjs";
import WebfontDownload from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/vite-plugin-webfont-dl@3.7.6_vite@5.0.0-beta.12/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import { AntDesignVueResolver } from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@4.1.4_vue@3.3.7/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import VueJsx from "file:///Users/sdl/Documents/Code/vite-antd-vue-starter/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.2_vite@5.0.0-beta.12_vue@3.3.7/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/sdl/Documents/Code/vite-antd-vue-starter";
var vite_config_default = defineConfig({
  server: {
    preTransformRequests: false
  },
  resolve: {
    alias: {
      "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`,
      "@/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
    }
  },
  plugins: [
    VueJsx(),
    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/]
        })
      }
    }),
    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ["vue", "tsx"]
    }),
    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/head",
        "@vueuse/core"
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/stores",
        "src/stores",
        "src/constants",
        "src/utils"
      ],
      vueTemplate: true
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue"],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "src/components.d.ts",
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
          // css in js
        })
      ]
    }),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),
    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),
    // https://github.com/webfansplz/vite-plugin-vue-devtools
    VueDevTools()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2RsL0RvY3VtZW50cy9Db2RlL3ZpdGUtYW50ZC12dWUtc3RhcnRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NkbC9Eb2N1bWVudHMvQ29kZS92aXRlLWFudGQtdnVlLXN0YXJ0ZXIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3NkbC9Eb2N1bWVudHMvQ29kZS92aXRlLWFudGQtdnVlLXN0YXJ0ZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IFZ1ZU1hY3JvcyBmcm9tICd1bnBsdWdpbi12dWUtbWFjcm9zL3ZpdGUnXG5pbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCBXZWJmb250RG93bmxvYWQgZnJvbSAndml0ZS1wbHVnaW4td2ViZm9udC1kbCdcbmltcG9ydCB7IEFudERlc2lnblZ1ZVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IFZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwcmVUcmFuc2Zvcm1SZXF1ZXN0czogZmFsc2UsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34vJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gLFxuICAgICAgJ0AvJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gLFxuICAgIH0sXG4gIH0sXG5cbiAgcGx1Z2luczogW1xuICAgIFZ1ZUpzeCgpLFxuICAgIFZ1ZU1hY3Jvcyh7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIHZ1ZTogVnVlKHtcbiAgICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvXSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hhbm5vZXJ1L3ZpdGUtcGx1Z2luLXBhZ2VzXG4gICAgUGFnZXMoe1xuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAndHN4J10sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vSm9obkNhbXBpb25Kci92aXRlLXBsdWdpbi12dWUtbGF5b3V0c1xuICAgIExheW91dHMoKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAnQHZ1ZXVzZS9oZWFkJyxcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICBdLFxuICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgIGRpcnM6IFtcbiAgICAgICAgJ3NyYy9jb21wb3NhYmxlcycsXG4gICAgICAgICdzcmMvc3RvcmVzJyxcbiAgICAgICAgJ3NyYy9zdG9yZXMnLFxuICAgICAgICAnc3JjL2NvbnN0YW50cycsXG4gICAgICAgICdzcmMvdXRpbHMnLFxuICAgICAgXSxcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICAvLyBhbGxvdyBhdXRvIGxvYWQgbWFya2Rvd24gY29tcG9uZW50cyB1bmRlciBgLi9zcmMvY29tcG9uZW50cy9gXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS9dLFxuICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgQW50RGVzaWduVnVlUmVzb2x2ZXIoe1xuICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZSwgLy8gY3NzIGluIGpzXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bm9jc3NcbiAgICAvLyBzZWUgdW5vLmNvbmZpZy50cyBmb3IgY29uZmlnXG4gICAgVW5vY3NzKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmVhdC1hZ2VuY3kvdml0ZS1wbHVnaW4td2ViZm9udC1kbFxuICAgIFdlYmZvbnREb3dubG9hZCgpLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYmZhbnNwbHovdml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXG4gICAgVnVlRGV2VG9vbHMoKSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStULE9BQU8sVUFBVTtBQUNoVixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGVBQWU7QUFDdEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8scUJBQXFCO0FBQzVCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sWUFBWTtBQVpuQixJQUFNLG1DQUFtQztBQWN6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixzQkFBc0I7QUFBQSxFQUN4QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxHQUFHLEtBQUssUUFBUSxrQ0FBVyxLQUFLLENBQUM7QUFBQSxNQUN2QyxNQUFNLEdBQUcsS0FBSyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsU0FBUztBQUFBLFFBQ1AsS0FBSyxJQUFJO0FBQUEsVUFDUCxTQUFTLENBQUMsUUFBUTtBQUFBLFFBQ3BCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQSxJQUdELE1BQU07QUFBQSxNQUNKLFlBQVksQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUMzQixDQUFDO0FBQUE7QUFBQSxJQUdELFFBQVE7QUFBQTtBQUFBLElBR1IsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsTUFDTCxNQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUE7QUFBQSxJQUdELFdBQVc7QUFBQTtBQUFBLE1BRVQsWUFBWSxDQUFDLEtBQUs7QUFBQSxNQUNsQixTQUFTLENBQUMsVUFBVSxZQUFZO0FBQUEsTUFDaEMsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBLFFBQ1QscUJBQXFCO0FBQUEsVUFDbkIsYUFBYTtBQUFBO0FBQUEsUUFDZixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsQ0FBQztBQUFBO0FBQUE7QUFBQSxJQUlELE9BQU87QUFBQTtBQUFBLElBR1AsZ0JBQWdCO0FBQUE7QUFBQSxJQUdoQixZQUFZO0FBQUEsRUFDZDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
