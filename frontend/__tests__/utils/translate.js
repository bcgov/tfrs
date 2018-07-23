import roleName from '../../src/utils/translate';

test('roleName should return the correct role description', () => {
  let value = roleName({
    id: 2
  });

  expect(value).toEqual('Government Analyst');

  value = roleName({
    id: 1
  });

  expect(value).toBeFalsy(); // since we don't have a record for 1 in the constants file
});
