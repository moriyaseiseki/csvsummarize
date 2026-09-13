<script lang="ts">
	import { page } from '$app/state';

	// Optional, or let type inference handle it
	// SvelteKit's native path resolution utility

	// Optional, or let type inference handle it
	// SvelteKit's native path resolution utility

	import * as Lucide from '@lucide/svelte';

	// Svelte 5 reactive snippet tracking the router location path
	const activePath = $derived(page.url.pathname);

	// Structured navigation routing matrix mapping
	// Analytics, Database and Settings are todo features: kept in code, hidden from the UI.
	// rel="external" keeps SvelteKit's prerender crawler (triggered by /terms) from following
	// these links and failing the build over routes that don't exist yet; "nofollow" is the
	// separate signal real search engines respect, so crawlers don't try to index these either.
	const tabs = [
		{ name: 'Overview', path: '/', icon: Lucide.Home, hidden: false },
		{ name: 'Analytics', path: '/analytics', icon: Lucide.BarChart3, hidden: true },
		{ name: 'Database', path: '/db', icon: Lucide.Database, hidden: true },
		{ name: 'Settings', path: '/settings', icon: Lucide.Settings, hidden: true },
		{ name: 'Explorer', path: '/explorer', icon: Lucide.Table2, hidden: false },
		{ name: 'Charts', path: '/charts', icon: Lucide.ChartColumn, hidden: false }
	];
</script>

<nav
	class="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/60 pb-[env(safe-area-inset-bottom)] z-50"
>
	<div class="grid grid-cols-3 h-16 w-full">
		{#each tabs as tab (tab.name)}
			{@const Icon = tab.icon}
			{@const isActive = activePath === tab.path}

			<a
				href={tab.path}
				hidden={tab.hidden}
				rel={tab.hidden ? 'external nofollow' : undefined}
				class="flex flex-col items-center justify-center gap-1 text-xs transition-colors duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-ring {isActive
					? 'text-primary font-medium'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<div class="p-1 rounded-full relative active:scale-90 transition-transform">
					<Icon class="h-5 w-5 stroke-2" />

					{#if isActive}
						<span
							class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
						></span>
					{/if}
				</div>

				<span class="text-[10px] tracking-wide font-medium">{tab.name}</span>
			</a>
		{/each}
	</div>
</nav>
