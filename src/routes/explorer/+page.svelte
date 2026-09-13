<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { csvSummaryState } from '$lib/csv-summary.svelte';
</script>

<div class="flex h-full flex-col gap-3 py-2">
	{#if csvSummaryState.fileName}
		<p class="shrink-0 truncate text-xs text-muted-foreground">{csvSummaryState.fileName}</p>
	{/if}

	{#if csvSummaryState.error}
		<div
			class="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
		>
			{csvSummaryState.error}
		</div>
	{:else if csvSummaryState.header && csvSummaryState.dataRows}
		<div class="min-h-0 flex-1 overflow-hidden rounded-lg border border-border/60">
			<Table.Root class="w-max min-w-full text-xs">
				<Table.Header>
					<Table.Row>
						{#each csvSummaryState.header as column (column)}
							<Table.Head class="sticky top-0 z-10 bg-background">{column}</Table.Head>
						{/each}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each csvSummaryState.dataRows as row, rowIndex (rowIndex)}
						<Table.Row>
							{#each row as cell, cellIndex (cellIndex)}
								<Table.Cell>{cell}</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{:else}
		<p class="mt-8 text-center text-sm text-muted-foreground">
			Tap the folder icon above to pick a CSV file.
		</p>
	{/if}
</div>
