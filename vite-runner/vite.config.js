import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'React.createElement',
    // jsxFragment: 'Fragment',
  },
})