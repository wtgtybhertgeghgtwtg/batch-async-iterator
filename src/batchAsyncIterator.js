// @flow
import invariant from 'assert';
import {
  $$asyncIterator,
  createAsyncIterator,
  isAsyncIterable,
  isIterable,
} from 'iterall';

export default function batchAsyncIterator<Yield>(
  iterable: AsyncIterable<Yield> | Iterable<Yield>,
  size: number,
): AsyncIterator<Array<Yield>> {
  invariant(
    isAsyncIterable(iterable) || isIterable(iterable),
    '"iterable" must be an AsyncIterable or Iterable.',
  );
  invariant(size >= 1, '"size" must be a positive integer.');
  const iterator = createAsyncIterator(iterable);

  const handlePromise = (resolve, reject) => {
    const batch = [];
    function getNext() {
      iterator.next().then(({done, value}) => {
        if (!done && batch.push(value) < size) {
          getNext();
        } else if (batch.length > 0) {
          resolve({done: false, value: batch});
        } else {
          resolve({done: true, value: undefined});
        }
      }, reject);
    }
    getNext();
  };

  // $FlowFixMe
  return {
    [$$asyncIterator]() {
      return this;
    },
    next() {
      return new Promise(handlePromise);
    },
  };
}
