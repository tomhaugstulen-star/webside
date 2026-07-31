import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/unit',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'line' : 'list',
  outputDir: 'test-results/unit',
})
