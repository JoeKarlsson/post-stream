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
        include: ['twemoji'],
    },
    define: {
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
        // Only expose Auth0 client ID and domain to frontend (public values)
        __AUTH0_CLIENT_ID__: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        __AUTH0_DOMAIN__: JSON.stringify(process.env.AUTH0_DOMAIN),
        __AUTH0_CALLBACK_URL__: JSON.stringify(process.env.AUTH0_CALLBACK_URL),
        // Note: AUTH0_CLIENT_SECRET and AUTH0_TOKEN should never be exposed to frontend
        // They should only be used server-side
    },
    // Disable source maps to fix pre-bundled dependency errors
    cssCodeSplit: false,
    sourcemap: true,
    build: {
        outDir: '../server/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'app/index.html')
        },
        sourcemap: true
    },
    server: {
        port: 3000,
        strictPort: true,
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
