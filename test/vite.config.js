import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

// 为了解决 __dirname 未定义的问题，使用 import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(
  '1111==========================',
  path.resolve(__dirname, '../packages/utils/src/index.ts')
)

// https://vite.dev/config/
/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  resolve: {
    alias: {
      '@cds-monitor': path.resolve(__dirname, '../packages')
    }
  },
  plugins: [vue()]
})
