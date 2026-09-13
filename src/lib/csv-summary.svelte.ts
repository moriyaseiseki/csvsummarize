import {
	parseCsv,
	summarizeCsv,
	formatFileSize,
	MAX_FILE_SIZE_BYTES,
	MAX_ROW_COUNT,
	type CsvSummary
} from './csv';

function createCsvSummaryState() {
	let fileName = $state<string | null>(null);
	let error = $state<string | null>(null);
	let summary = $state<CsvSummary | null>(null);
	let rows = $state<string[][] | null>(null);

	async function loadFile(file: File) {
		fileName = file.name;
		error = null;
		summary = null;
		rows = null;

		if (file.size > MAX_FILE_SIZE_BYTES) {
			error = `This file is too large (${formatFileSize(file.size)}). Please choose a file under ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`;
			return;
		}

		try {
			const text = await file.text();
			const parsedRows = parseCsv(text);
			const dataRowCount = parsedRows.length - 1;

			if (dataRowCount > MAX_ROW_COUNT) {
				error = `This file has too many rows (${dataRowCount.toLocaleString()}). Please choose a file with fewer than ${MAX_ROW_COUNT.toLocaleString()} rows.`;
				return;
			}

			rows = parsedRows;
			summary = summarizeCsv(parsedRows);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to parse CSV file.';
		}
	}

	return {
		get fileName() {
			return fileName;
		},
		get error() {
			return error;
		},
		get summary() {
			return summary;
		},
		/** Header row, or null if no CSV is loaded. */
		get header() {
			return rows?.[0] ?? null;
		},
		/** Data rows (everything after the header), or null if no CSV is loaded. */
		get dataRows() {
			return rows?.slice(1) ?? null;
		},
		loadFile
	};
}

/** Shared across the header's file-picker button and the page that renders the result. */
export const csvSummaryState = createCsvSummaryState();
