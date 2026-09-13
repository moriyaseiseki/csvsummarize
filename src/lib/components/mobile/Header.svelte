<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { csvSummaryState } from '$lib/csv-summary.svelte';
	import * as Lucide from '@lucide/svelte';

	// Svelte 5 reactive context tracking
	const isRoot = $derived(page.url.pathname === '/');
	const currentTitle = $derived(
		page.url.pathname === '/'
			? 'DASHBOARD'
			: page.url.pathname.split('/').pop()?.toUpperCase() || ''
	);

	function handleBack() {
		window.history.back();
	}

	let fileInput: HTMLInputElement | undefined = $state();

	function openFilePicker() {
		fileInput?.click();
	}

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			csvSummaryState.loadFile(file);
		}
		// Allow re-selecting the same file to trigger another change event.
		input.value = '';
	}
</script>

<header
	class="absolute top-0 left-0 right-0 h-14 border-b border-border/60 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-50"
>
	<div class="w-10 flex items-center">
		{#if isRoot}
			<Sheet.Root>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							class="rounded-full h-9 w-9 active:scale-95 transition-transform"
							aria-label="Open menu"
						>
							<Lucide.Menu class="h-5 w-5 stroke-2" />
						</Button>
					{/snippet}
				</Sheet.Trigger>

				<Sheet.Content
					side="left"
					class="w-72.5 p-0 flex flex-col justify-between h-full bg-card rounded-r-2xl border-r border-border/40"
				>
					<div class="p-5 pt-12 space-y-6">
						<div class="flex items-center gap-3 px-2">
							<div
								class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
							>
								<Lucide.FileSpreadsheet class="h-4 w-4" />
							</div>
							<div>
								<h2 class="text-sm font-bold tracking-tight">CSV Summarize</h2>
								<p class="text-[10px] text-muted-foreground font-mono">v1.0.0</p>
							</div>
						</div>

						<hr class="border-border/40" />

						<nav class="flex flex-col gap-1">
							<a
								href="/terms"
								class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-all select-none"
							>
								<Lucide.ScrollText class="h-4 w-4" /> Terms of Service
							</a>
							<!--
							TODO: these are placeholder/todo features; kept in code but hidden.
							rel="external" keeps SvelteKit's prerender crawler (triggered by /terms) from
							following these links and failing the build over routes that don't exist yet;
							"nofollow" is the separate signal real search engines respect, so crawlers
							don't try to index these either.
						-->
							<a
								href="/profile"
								hidden
								rel="external nofollow"
								class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-all select-none"
							>
								<Lucide.User class="h-4 w-4" /> Account Settings
							</a>
							<a
								href="/organization"
								hidden
								rel="external nofollow"
								class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-all select-none"
							>
								<Lucide.Building2 class="h-4 w-4" /> Team Shared Nodes
							</a>
							<a
								href="/tokens"
								hidden
								rel="external nofollow"
								class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-all select-none"
							>
								<Lucide.KeyRound class="h-4 w-4" /> API Gateway Keys
							</a>
							<a
								href="/logs"
								hidden
								rel="external nofollow"
								class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-all select-none"
							>
								<Lucide.Terminal class="h-4 w-4" /> Runtime Diagnostics
							</a>
						</nav>
					</div>

					<div class="p-4 border-t border-border/40 bg-muted/30">
						<a
							href="/logout"
							hidden
							rel="external nofollow"
							class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 active:bg-destructive/15 transition-all select-none"
						>
							<Lucide.LogOut class="h-4 w-4" /> Terminate Session
						</a>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		{:else}
			<Button
				variant="ghost"
				size="icon"
				class="rounded-full h-9 w-9 active:scale-95 transition-transform"
				onclick={handleBack}
				aria-label="Go back"
			>
				<Lucide.ChevronLeft class="h-5 w-5 stroke-[2.5]" />
			</Button>
		{/if}
	</div>

	<h1 class="text-xs font-bold tracking-widest text-foreground selection:bg-transparent">
		{currentTitle}
	</h1>

	<div class="w-10 flex items-center justify-end">
		<input
			bind:this={fileInput}
			type="file"
			accept=".csv,text/csv"
			class="hidden"
			onchange={handleFileChange}
		/>
		<Button
			variant="ghost"
			size="icon"
			class="rounded-full h-9 w-9 active:scale-95 transition-transform"
			onclick={openFilePicker}
			aria-label="Choose CSV file"
		>
			<Lucide.Folder class="h-4 w-4 text-muted-foreground" />
		</Button>
	</div>
</header>
