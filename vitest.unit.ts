import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

const isPipeline = !!process.env.CI;

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/unit/*.test.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		globals: true,
		environment: 'node',
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
