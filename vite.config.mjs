import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const apiServer = 'http://localhost:3001'

export default defineConfig({
    plugins: [react()],
    root: 'app',
    build: {
        outDir: '../server/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(import.meta.dirname, 'app/index.html')
        }
    },
    server: {
        port: 3000,
        strictPort: true,
        proxy: {
            '/post': apiServer,
            '/auth': apiServer,
            // Plain-text feeds; /user/:name without .txt is the app's own page
            '^/user/[^/]+\\.txt$': apiServer
        }
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
            generateScopedName: '[path][local]__[hash:base64:5]'
        }
    }
})
