import arrayMove from '../../src/utils/functions';

test('Array Move to actually function as expected', () => {
  const arr = [1, 2, 3, 4, 5];

  // (array to manipulate, current index to move, index to move to)
  arrayMove(arr, 2, 1);

  expect(arr).toEqual([1, 3, 2, 4, 5]);
});
