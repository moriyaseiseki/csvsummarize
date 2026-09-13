import { describe, it, expect } from 'vitest';
import { parseCsv, summarizeCsv, formatNumber, numericColumnValues, formatFileSize } from './csv';

describe('parseCsv', () => {
	it('parses simple comma-separated rows', () => {
		expect(parseCsv('a,b\n1,2\n3,4')).toEqual([
			['a', 'b'],
			['1', '2'],
			['3', '4']
		]);
	});

	it('handles quoted fields with commas, escaped quotes and newlines', () => {
		expect(parseCsv('a,b\n"1,000","she said ""hi"""\n"multi\nline",2')).toEqual([
			['a', 'b'],
			['1,000', 'she said "hi"'],
			['multi\nline', '2']
		]);
	});

	it('ignores trailing blank lines', () => {
		expect(parseCsv('a,b\n1,2\n\n')).toEqual([
			['a', 'b'],
			['1', '2']
		]);
	});

	it('throws on an unterminated quoted field', () => {
		expect(() => parseCsv('a,b\n"1,2')).toThrow(/never closed/);
	});

	it('throws on inconsistent column counts', () => {
		expect(() => parseCsv('a,b\n1,2\n3')).toThrow(/column/);
	});

	it('throws on empty input', () => {
		expect(() => parseCsv('')).toThrow(/empty/);
		expect(() => parseCsv('\n\n')).toThrow(/empty/);
	});
});

describe('summarizeCsv', () => {
	it('reports the row count', () => {
		const summary = summarizeCsv([['a'], ['1'], ['2'], ['3']]);
		expect(summary.rowCount).toBe(3);
	});

	it('detects a bool column', () => {
		const summary = summarizeCsv([['active'], ['true'], ['False'], ['TRUE']]);
		expect(summary.columns[0]).toEqual({ name: 'active', type: 'bool' });
	});

	it('detects a numerical column and computes stats', () => {
		const summary = summarizeCsv([['n'], ['1'], ['2'], ['3'], ['4']]);
		expect(summary.columns[0]).toEqual({
			name: 'n',
			type: 'numerical',
			max: 4,
			min: 1,
			average: 2.5
		});
	});

	it('treats mixed non-numeric values as categorical', () => {
		const summary = summarizeCsv([['color'], ['red'], ['blue'], ['red']]);
		expect(summary.columns[0]).toEqual({ name: 'color', type: 'categorical' });
	});

	it('ignores blank cells when inferring type', () => {
		const summary = summarizeCsv([['n'], ['1'], [''], ['3']]);
		expect(summary.columns[0].type).toBe('numerical');
		expect(summary.columns[0].average).toBe(2);
	});
});

describe('numericColumnValues', () => {
	it('extracts a column in row order, skipping blank and non-numeric cells', () => {
		const dataRows = [
			['1', 'x'],
			['', 'y'],
			['3', 'z'],
			['not a number', 'w']
		];
		expect(numericColumnValues(dataRows, 0)).toEqual([1, 3]);
	});
});

describe('formatFileSize', () => {
	it('formats bytes as a human-readable MB string', () => {
		expect(formatFileSize(50 * 1024 * 1024)).toBe('50.0 MB');
		expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
	});
});

describe('formatNumber', () => {
	it('rounds to at most 2 decimals and drops trailing zeros', () => {
		expect(formatNumber(353.2)).toBe('353.2');
		expect(formatNumber(353)).toBe('353');
		expect(formatNumber(33.333333)).toBe('33.33');
	});
});
