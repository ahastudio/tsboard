// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import ViteFonts from "unplugin-fonts/vite"

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

/**
 * TSBOARD 클라이언트쪽 설정 파일
 * 서버쪽 설정은 .env 파일 참조
 *
 * 매뉴얼 | https://github.com/sirini/tsboard
 * 문의 | https://tsboard.dev
 *
 */
const IS_DEV = true // [A]
const PREFIX = IS_DEV ? "" : __dirname.split("/").pop() // [B]
const VITE_PORT = 3000 // [C]
const SERVER_PORT = 3100 // [D]
const MAX_FILE_SIZE = 10247680 // [E]
const DEV_API_PATH = `http://localhost:${SERVER_PORT}` // [F]
const PROD_API_PATH = `http://PLEASE__UPDATE__HERE:${SERVER_PORT}` // [G]
const API = IS_DEV ? DEV_API_PATH : PROD_API_PATH // [H]

// 위의 내용만 수정하시고, 아래 내용은 그대로 두세요!

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
  ],
  define: {
    "process.env": {
      API,
      PREFIX,
      MAX_FILE_SIZE,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: VITE_PORT,
  },
})
