import { cpus } from 'node:os';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const isPipeline = !!process.env.CI;

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/components/*.test.ts'],
		setupFiles: ['tests/components/setup.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		globals: true,
		environment: 'jsdom',
		maxConcurrency: cpus().length,
		cacheDir: '/tmp/.vitest-cache',
		typecheck: {
			checker: 'tsc'
		},
		sequence: {
			shuffle: true
		}
	}
});
