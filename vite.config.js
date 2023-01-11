import { sveltekit } from '@sveltejs/kit/vite';

const isPipeline = !!process.env.CI;

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.test.ts', 'tests/components/*.test.ts'],
		reporters: ['verbose'],
		allowOnly: !isPipeline,
		globals: true,
		environment: 'happy-dom',
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
	},
	fs: {
		allow: ['..']
	}
};

export default config;
