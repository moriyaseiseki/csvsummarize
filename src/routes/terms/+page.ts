// Overrides the root layout's `ssr = false` / `prerender = false` so this page is baked
// into a real, crawlable static HTML file at build time instead of falling back to the SPA shell.
export const prerender = true;
export const ssr = true;
