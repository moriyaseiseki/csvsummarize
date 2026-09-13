<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatNumber } from '$lib/csv';
	import { csvSummaryState } from '$lib/csv-summary.svelte';
</script>

<div class="flex flex-col gap-4 py-2">
	{#if csvSummaryState.fileName}
		<p class="text-xs text-muted-foreground truncate">{csvSummaryState.fileName}</p>
	{/if}

	{#if csvSummaryState.error}
		<div
			class="text-sm text-destructive border border-destructive/40 rounded-lg p-3 bg-destructive/10"
		>
			{csvSummaryState.error}
		</div>
	{/if}

	{#if csvSummaryState.summary}
		<Card.Root>
			<Card.Content class="text-sm font-mono">
				row count: {csvSummaryState.summary.rowCount}
			</Card.Content>
		</Card.Root>

		{#each csvSummaryState.summary.columns as column (column.name)}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">{column.name}</Card.Title>
				</Card.Header>
				<Card.Content class="text-xs font-mono space-y-1">
					<div>type: {column.type}</div>
					{#if column.type === 'numerical'}
						<div>max value: {formatNumber(column.max ?? 0)}</div>
						<div>min value: {formatNumber(column.min ?? 0)}</div>
						<div>average value: {formatNumber(column.average ?? 0)}</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}
	{:else if !csvSummaryState.error}
		<p class="text-sm text-muted-foreground text-center mt-8">
			Tap the folder icon above to pick a CSV file.
		</p>
	{/if}
</div>
