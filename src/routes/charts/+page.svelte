<script lang="ts">
	import { LineChart } from 'layerchart';
	import * as Card from '$lib/components/ui/card';
	import * as Chart from '$lib/components/ui/chart';
	import type { ChartConfig } from '$lib/components/ui/chart';
	import { numericColumnValues } from '$lib/csv';
	import { csvSummaryState } from '$lib/csv-summary.svelte';

	const numericColumns = $derived(
		csvSummaryState.summary?.columns.filter((column) => column.type === 'numerical') ?? []
	);

	function seriesFor(columnName: string) {
		const header = csvSummaryState.header;
		const dataRows = csvSummaryState.dataRows;
		const columnIndex = header?.indexOf(columnName) ?? -1;
		if (!dataRows || columnIndex === -1) return [];
		return numericColumnValues(dataRows, columnIndex).map((value, index) => ({ index, value }));
	}

	const chartConfig = { value: { label: 'Value' } } satisfies ChartConfig;
</script>

<div class="flex flex-col gap-4 py-2">
	{#if csvSummaryState.fileName}
		<p class="text-xs text-muted-foreground truncate">{csvSummaryState.fileName}</p>
	{/if}

	{#if csvSummaryState.error}
		<div
			class="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
		>
			{csvSummaryState.error}
		</div>
	{:else if numericColumns.length > 0}
		{#each numericColumns as column, columnIndex (column.name)}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">{column.name}</Card.Title>
				</Card.Header>
				<Card.Content>
					<Chart.Container config={chartConfig} class="h-32 w-full">
						<LineChart
							data={seriesFor(column.name)}
							x="index"
							y="value"
							axis={false}
							grid={false}
							props={{
								spline: {
									stroke: `var(--chart-${(columnIndex % 5) + 1})`,
									class: 'stroke-2'
								}
							}}
						>
							{#snippet tooltip()}
								<Chart.Tooltip labelFormatter={(value) => `Row: ${value}`} />
							{/snippet}
						</LineChart>
					</Chart.Container>
				</Card.Content>
			</Card.Root>
		{/each}
	{:else if csvSummaryState.fileName}
		<p class="mt-8 text-center text-sm text-muted-foreground">
			No numeric columns to chart in this file.
		</p>
	{:else}
		<p class="mt-8 text-center text-sm text-muted-foreground">
			Tap the folder icon above to pick a CSV file.
		</p>
	{/if}
</div>
