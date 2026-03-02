import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: 'tests/coverage'
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@backend': path.resolve(__dirname, './src/backend/src'),
            '@shared': path.resolve(__dirname, './src/shared')
        }
    }
});
//# sourceMappingURL=vitest.config.js.map