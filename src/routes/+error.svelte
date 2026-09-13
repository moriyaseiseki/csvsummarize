<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Lucide from '@lucide/svelte';
</script>

<div class="flex h-full flex-col items-center justify-center gap-3 py-2 text-center">
	<Lucide.SearchX class="h-8 w-8 text-muted-foreground" />
	<p class="text-sm font-medium text-foreground">{page.status}</p>
	<p class="text-sm text-muted-foreground">{page.error?.message ?? 'Something went wrong.'}</p>
	<Button href="/" variant="outline" size="sm" class="mt-2">Go to Home</Button>
</div>
