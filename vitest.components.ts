import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { cpus } from 'node:os';

const isPipeline = !!process.env.CI;

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/components/*.test.ts'],
		setupFiles: ['tests/components/setup.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		globals: true,
		environment: 'happy-dom',
		maxConcurrency: cpus().length,
		cache: {
			dir: '/tmp/.vitest-cache'
		},
		typecheck: {
			checker: 'tsc'
		},
		sequence: {
			shuffle: true
		}
	}
});
