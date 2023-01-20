import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

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
