import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'

const apiServer = 'http://localhost:3001'

// GitHub Pages can't send headers, so the static demo carries its CSP as a
// <meta> tag (frame-ancestors and Permissions-Policy can't be set this way)
const DEMO_CSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
].join('; ')

// The static demo (npm run build:demo): start from the demo entry, which
// installs the in-browser API, and serve the app for every path on Pages
const staticDemo = () => ({
    name: 'poststream-static-demo',
    // 'pre': Vite reads the entry <script> out of the HTML, so swap it before that
    transformIndexHtml: {
        order: 'pre',
        handler: (html) =>
            html
                .replace('/components/entry.tsx', '/components/demoEntry.tsx')
                .replace(
                    '<meta charset="utf-8" />',
                    `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${DEMO_CSP}" />`
                )
    },
    // Pages serves 404.html for any unknown path, so deep links still load the app
    closeBundle() {
        const out = path.resolve(import.meta.dirname, 'dist-demo')
        fs.copyFileSync(path.join(out, 'index.html'), path.join(out, '404.html'))
    }
})

export default defineConfig(({ mode }) => ({
    plugins: [react(), ...(mode === 'demo' ? [staticDemo()] : [])],
    root: 'app',
    build: {
        outDir: mode === 'demo' ? '../dist-demo' : '../server/dist',
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
    // Previewing the static demo: no API to proxy to (preview inherits server.proxy)
    preview: mode === 'demo' ? { proxy: {} } : {},
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
            generateScopedName: '[path][local]__[hash:base64:5]'
        }
    }
}))
