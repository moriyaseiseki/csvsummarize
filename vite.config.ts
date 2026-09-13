import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				fallback: 'index.html',
				precompress: true // only for production builds, see: https://kit.svelte.dev/docs/adapter-static#precompress
			}),
			alias: {
				$lib: './src/lib',
				'$lib/*': './src/lib/*',
				'$lib/components/*': './src/lib/components/*'
			},
			// Since the whole app builds to static/prerendered HTML (adapter-static), SvelteKit
			// delivers this via a <meta http-equiv> tag and computes the script-src hash for its
			// own inline hydration bootstrap script automatically on every build — no manual/stale
			// hash to maintain. style-src needs 'unsafe-inline' because Svelte's own transitions,
			// and shadcn's Chart component, inject inline <style> elements at runtime.
			// frame-ancestors/report-uri/sandbox are ignored in meta-tag CSP, so those (and the
			// other static, non-hash directives) are set via a real header in static/_headers instead.
			csp: {
				mode: 'auto',
				directives: {
					'script-src': ['self'],
					'style-src': ['self', 'unsafe-inline']
				}
			}
		})
	],
	server: {
		host: true, // Listens on 0.0.0.0 to expose the container bridge to Windows
		port: 5173,
		strictPort: true, // Prevents Vite from shifting to 5174 if a socket hangs
		watch: {
			usePolling: true // Ensures instant hot-reloads inside WSL2/Docker volumes
		}
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
