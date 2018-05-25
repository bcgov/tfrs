import filterNumber from '../../src/utils/filters';

test('Filter Number should return true since 1.4 is part of 1.45', () => {
  const value = filterNumber('1.4', '1.45');

  expect(value).toBeTruthy();
});

test('Filter Number should automatically clear out commas when matching', () => {
  const value = filterNumber('1,0', '10.45', 1);

  expect(value).toBeTruthy();
});

test('Filter Number should return false since 1.46 does not equals 1.45', () => {
  const value = filterNumber('1.46', '1.45', 2);

  expect(value).toBeFalsy();
});
