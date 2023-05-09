import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { cpus } from 'node:os';

const isPipeline = !!process.env.CI;

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/unit/*.test.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		globals: true,
		environment: 'node',
		maxConcurrency: cpus().length,
		cache: {
			dir: '/tmp/.vitest-cache'
		},
		typecheck: {
			checker: 'tsc'
		},
		sequence: {
			shuffle: true
		},
		coverage: {
			enabled: true,
			provider: 'c8',
			reporter: ['text', 'html']
		}
	}
});
