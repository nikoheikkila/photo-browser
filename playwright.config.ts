import type { PlaywrightTestConfig } from '@playwright/test';

const isPipeline = !!process.env.CI;
const webServerPort = 5173;
const baseURL = `http://localhost:${webServerPort}`;

const config: PlaywrightTestConfig = {
	testDir: 'tests/e2e',
	testMatch: '*.spec.ts',
	fullyParallel: true,
	workers: '80%',
	forbidOnly: isPipeline,
	use: {
		baseURL,
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		trace: 'retain-on-failure',
		userAgent: 'Microsoft Playwright'
	},
	webServer: {
		command: `npx vite preview --port ${webServerPort}`,
		url: baseURL,
		reuseExistingServer: true
	},
	projects: [
		{
			name: 'Chromium',
			use: { browserName: 'chromium' }
		},
		{
			name: 'Firefox',
			use: { browserName: 'firefox' }
		},
		{
			name: 'Webkit',
			use: { browserName: 'webkit' }
		}
	]
};

export default config;
