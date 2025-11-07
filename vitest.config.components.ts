import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const isPipeline = !!process.env.CI;

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [
				{ browser: 'chromium', name: 'Component Tests (Chromium)' },
				{ browser: 'firefox', name: 'Component Tests (Firefox)' },
				{ browser: 'webkit', name: 'Component Tests (WebKit)' }
			]
		},
		include: ['tests/components/**/*.test.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		typecheck: {
			checker: 'tsc'
		},
		sequence: {
			shuffle: true
		}
	}
});
