import { defineConfig, devices } from '@playwright/test';

/**
 * Alternative Playwright configuration example using project-level authentication setup
 * This approach can be used instead of global setup if you need different auth states 
 * for different test suites or want more granular control
 */
export default defineConfig({
    testDir: './e2e-tests/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    timeout: 30 * 1000,
    use: {
        baseURL: 'http://localhost:8080',
        trace: 'on-first-retry',
    },

    projects: [
        // Setup project
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        
        // Authenticated tests
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use the authentication state from setup
                storageState: './e2e-tests/auth-state.json',
            },
            dependencies: ['setup'],
        },
    ],
});