import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./src/test/setup.js'],
        css: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '*.config.js',
                'src/main.jsx'
            ]
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
})
