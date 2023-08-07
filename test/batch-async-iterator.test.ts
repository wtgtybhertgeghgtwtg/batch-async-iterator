/* eslint-disable require-yield */
import fillRange from 'fill-range';
import batchAsyncIterator from '../source/index.js';

describe('batchAsyncIterator', () => {
	describe('invariants', () => {
		it('throws if "iterable" is neither an AsyncIterable nor an Iterable.', () => {
			// @ts-expect-error
			expect(() => batchAsyncIterator(3)).toThrow(
				'"iterable" must be an AsyncIterable or Iterable.',
			);
		});

		it.each`
			condition         | size
			${'undefined'}    | ${undefined}
			${'not a number'} | ${'Not a number.'}
			${'negative'}     | ${-1}
			${'zero'}         | ${0}
		`('throws if "size" is $condition.', ({size}) => {
			expect(() => batchAsyncIterator([], size)).toThrow(
				'"size" must be a positive integer.',
			);
		});
	});

	it('batches an AsyncIterable.', async () => {
		const input = fillRange(0, 1000);
		const result = [];
		const size = 7;
		const iterator = batchAsyncIterator(
			(async function* () {
				yield* input;
			})(),
			size,
		);
		for await (const batch of iterator) {
			expect(batch.length).toBeLessThanOrEqual(size);
			result.push(...batch);
		}
		expect(result).toEqual(input);
	});

	it('batches an Iterable.', async () => {
		const input = fillRange(0, 1000);
		const result = [];
		const size = 7;
		const iterator = batchAsyncIterator(input, size);
		for await (const batch of iterator) {
			expect(batch.length).toBeLessThanOrEqual(size);
			result.push(...batch);
		}
		expect(result).toEqual(input);
	});

	it('rejects if "iterable" rejects.', async () => {
		const message = 'Iterable rejects.';
		async function* iterable() {
			throw new Error(message);
		}
		const iterator = batchAsyncIterator(iterable(), 1);
		expect(iterator.next()).rejects.toThrow(message);
	});

	it('rejects if "iterable" throws.', async () => {
		const message = 'Iterable rejects.';
		function* iterable() {
			throw new Error(message);
		}
		const iterator = batchAsyncIterator(iterable(), 1);
		expect(iterator.next()).rejects.toThrow(message);
	});
});
