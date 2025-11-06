import { describe, expect, test } from 'vitest';
import { parseDimensions } from '$lib/domain/Dimensions';

describe('Dimensions Parser', () => {
	test('parses valid dimension data', () => {
		const data = { width: 150, height: 200 };

		const result = parseDimensions(data);

		expect(result).toStrictEqual({ width: 150, height: 200 });
	});

	test('parses dimension data with positive integers', () => {
		const data = { width: 1, height: 1 };

		const result = parseDimensions(data);

		expect(result).toStrictEqual({ width: 1, height: 1 });
	});

	test('throws error for invalid data with exact message', () => {
		expect(() => parseDimensions({})).toThrow('Can not parse dimensions from invalid data');
	});

	test('throws error for missing width', () => {
		const data = { height: 200 };

		expect(() => parseDimensions(data)).toThrow('Can not parse dimensions from invalid data');
	});

	test('throws error for missing height', () => {
		const data = { width: 150 };

		expect(() => parseDimensions(data)).toThrow('Can not parse dimensions from invalid data');
	});

	test('throws error for zero width', () => {
		const data = { width: 0, height: 200 };

		expect(() => parseDimensions(data)).toThrow('Width must be greater than zero');
	});

	test('throws error for zero height', () => {
		const data = { width: 150, height: 0 };

		expect(() => parseDimensions(data)).toThrow('Height must be greater than zero');
	});

	test('throws error for negative width', () => {
		const data = { width: -10, height: 200 };

		expect(() => parseDimensions(data)).toThrow('Width must be greater than zero');
	});

	test('throws error for negative height', () => {
		const data = { width: 150, height: -10 };

		expect(() => parseDimensions(data)).toThrow('Height must be greater than zero');
	});

	test('throws error for non-numeric width', () => {
		const data = { width: 'abc', height: 200 };

		expect(() => parseDimensions(data)).toThrow('Can not parse dimensions from invalid data');
	});

	test('throws error for non-numeric height', () => {
		const data = { width: 150, height: 'abc' };

		expect(() => parseDimensions(data)).toThrow('Can not parse dimensions from invalid data');
	});

	test('throws error for null data', () => {
		expect(() => parseDimensions(null as unknown as Dictionary)).toThrow(
			'Can not parse dimensions from invalid data'
		);
	});

	test('throws error for undefined data', () => {
		expect(() => parseDimensions(undefined as unknown as Dictionary)).toThrow(
			'Can not parse dimensions from invalid data'
		);
	});
});
