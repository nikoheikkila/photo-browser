import { cpus } from 'node:os';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const isPipeline = !!process.env.CI;

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		name: 'Unit Tests',
		include: ['tests/unit/*.test.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		globals: true,
		environment: 'node',
		maxConcurrency: cpus().length,
		typecheck: {
			checker: 'tsc'
		},
		sequence: {
			shuffle: true
		},
		coverage: {
			enabled: true,
			provider: 'v8',
			reporter: ['text', 'html']
		}
	}
});
