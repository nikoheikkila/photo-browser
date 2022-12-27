import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: '*.spec.ts',
	fullyParallel: true,
	workers: '80%',
	webServer: {
		command: 'npx vite preview',
		port: 4173
	}
};

export default config;
