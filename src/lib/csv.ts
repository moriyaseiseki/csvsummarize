export type ColumnType = 'bool' | 'categorical' | 'numerical';

export interface ColumnSummary {
	name: string;
	type: ColumnType;
	max?: number;
	min?: number;
	average?: number;
}

export interface CsvSummary {
	rowCount: number;
	columns: ColumnSummary[];
}

/**
 * Guardrails against files that would hang or crash the tab. The Explorer table renders
 * every row as real DOM (no virtualization) and Charts plots every row as an SVG point per
 * numeric column, so row count — not byte size — is the more likely thing to blow up first;
 * a CSV can be small in bytes but have a huge row count (short rows, many of them).
 */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_ROW_COUNT = 50_000;

/** Formats a byte count as a human-readable MB string, e.g. "12.3 MB". */
export function formatFileSize(bytes: number): string {
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Parses RFC-4180-ish CSV text into rows of fields, handling quoted fields
 * (with "" as an escaped quote) and quoted newlines. Throws on unterminated
 * quotes or rows whose column count doesn't match the header row.
 */
export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let inQuotes = false;
	let i = 0;
	const n = text.length;

	const pushField = () => {
		row.push(field);
		field = '';
	};
	const pushRow = () => {
		pushField();
		rows.push(row);
		row = [];
	};

	while (i < n) {
		const char = text[i];

		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i += 2;
					continue;
				}
				inQuotes = false;
				i++;
				continue;
			}
			field += char;
			i++;
			continue;
		}

		if (char === '"') {
			inQuotes = true;
			i++;
			continue;
		}
		if (char === ',') {
			pushField();
			i++;
			continue;
		}
		if (char === '\r') {
			i++;
			continue;
		}
		if (char === '\n') {
			pushRow();
			i++;
			continue;
		}
		field += char;
		i++;
	}

	if (inQuotes) {
		throw new Error('Invalid CSV: a quoted field is never closed.');
	}

	if (field !== '' || row.length > 0) {
		pushRow();
	}

	const nonBlankRows = rows.filter((r) => !(r.length === 1 && r[0] === ''));

	if (nonBlankRows.length === 0) {
		throw new Error('The CSV file is empty.');
	}

	const columnCount = nonBlankRows[0].length;
	nonBlankRows.forEach((r, index) => {
		if (r.length !== columnCount) {
			throw new Error(
				`Invalid CSV: row ${index + 1} has ${r.length} column(s), expected ${columnCount}.`
			);
		}
	});

	return nonBlankRows;
}

function isNumeric(value: string): boolean {
	return value !== '' && !Number.isNaN(Number(value));
}

function isBool(value: string): boolean {
	const lower = value.toLowerCase();
	return lower === 'true' || lower === 'false';
}

export function summarizeCsv(rows: string[][]): CsvSummary {
	const [header, ...dataRows] = rows;

	const columns: ColumnSummary[] = header.map((name, colIndex) => {
		const values = dataRows.map((r) => r[colIndex].trim()).filter((v) => v !== '');

		if (values.length > 0 && values.every(isBool)) {
			return { name, type: 'bool' };
		}

		if (values.length > 0 && values.every(isNumeric)) {
			const numbers = values.map(Number);
			const sum = numbers.reduce((total, value) => total + value, 0);
			return {
				name,
				type: 'numerical',
				max: Math.max(...numbers),
				min: Math.min(...numbers),
				average: sum / numbers.length
			};
		}

		return { name, type: 'categorical' };
	});

	return { rowCount: dataRows.length, columns };
}

/** Rounds to at most 2 decimal places and drops trailing zeros. */
export function formatNumber(value: number): string {
	return String(Math.round(value * 100) / 100);
}

/** Numeric values of one column, in row order, skipping blank/non-numeric cells. */
export function numericColumnValues(dataRows: string[][], columnIndex: number): number[] {
	return dataRows
		.map((row) => row[columnIndex]?.trim())
		.filter((value): value is string => value !== undefined && isNumeric(value))
		.map(Number);
}
