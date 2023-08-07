export default function batchAsyncIterator<Yield>(
	iterable: AsyncIterable<Yield> | Iterable<Yield>,
	size: number,
): AsyncIterableIterator<Yield[]> {
	if (
		(iterable as Iterable<Yield>)[Symbol.iterator] === undefined &&
		(iterable as AsyncIterable<Yield>)[Symbol.asyncIterator] === undefined
	) {
		throw new TypeError('"iterable" must be an AsyncIterable or Iterable.');
	}

	if (!Number.isSafeInteger(size) || size < 1) {
		throw new RangeError('"size" must be a positive integer.');
	}

	const iterator =
		Symbol.iterator in iterable
			? iterable[Symbol.iterator]()
			: iterable[Symbol.asyncIterator]();
	let isDone = false;
	return {
		[Symbol.asyncIterator]() {
			return this;
		},
		async next() {
			const batch = [];
			while (!isDone) {
				const {done, value} = await iterator.next();
				if (done) {
					isDone = true;
				} else {
					batch.push(value);
				}

				if (batch.length > 0 && (isDone || batch.length === size)) {
					return {done: false, value: batch};
				}
			}

			return {done: true, value: undefined};
		},
	};
}
