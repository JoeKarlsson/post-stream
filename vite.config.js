import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            include: /\.(jsx|js|tsx|ts)$/,
        })
    ],
    root: 'app',
    esbuild: {
        loader: 'jsx',
        include: /app\/.*\.js$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
        // Force re-bundling of dependencies to fix source map issues
        force: true,
    },
    define: {
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
        __AUTH0_CLIENT_ID__: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        __AUTH0_CLIENT_SECRET__: JSON.stringify(process.env.AUTH0_CLIENT_SECRET),
        __AUTH0_TOKEN__: JSON.stringify(process.env.AUTH0_TOKEN),
        __AUTH0_DOMAIN__: JSON.stringify(process.env.AUTH0_DOMAIN),
        __AUTH0_CALLBACK_URL__: JSON.stringify(process.env.AUTH0_CALLBACK_URL),
    },
    // Disable source maps to fix pre-bundled dependency errors
    cssCodeSplit: false,
    sourcemap: false,
    build: {
        outDir: '../server/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'app/index.html')
        },
        sourcemap: false
    },
    server: {
        port: 3000,
        proxy: {
            '/post': {
                target: 'http://localhost:3001',
                changeOrigin: true
            },
            '/auth': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
            generateScopedName: '[path][local]__[hash:base64:5]',
            // Make all .scss files use CSS modules by default
            scopeBehaviour: 'local'
        },
        preprocessorOptions: {
            scss: {
                api: 'modern'
            }
        }
    }
})
