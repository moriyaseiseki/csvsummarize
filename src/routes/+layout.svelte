<script lang="ts">
	import BottomNav from '$lib/components/mobile/BottomNav.svelte';
	import Header from '$lib/components/mobile/Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<div
	class="h-dvh w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex flex-col relative bg-background select-none overflow-hidden"
>
	<Header />

	<main class="flex-1 min-h-0 overflow-y-auto touch-pan-y pt-14 pb-16 px-4 style-scrollbar">
		{@render children?.()}
	</main>

	<BottomNav />
</div>

<style>
	/* Optimization rules to hide visual scroll bars during touch velocity swipes */
	.style-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.style-scrollbar {
		-ms-overflow-style: none;
		/* Manually removed */
		/* scrollbar-width: none; */
		-webkit-overflow-scrolling: touch; /* High-performance momentum momentum physics on iOS devices */
	}
</style>
