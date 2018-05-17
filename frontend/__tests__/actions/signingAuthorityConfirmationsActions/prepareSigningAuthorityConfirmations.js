import { prepareSigningAuthorityConfirmations } from '../../../src/actions/signingAuthorityConfirmationsActions';

test('prepareSigningAuthorityConfirmations should return the right data for Confirmations', () => {
  const data = prepareSigningAuthorityConfirmations(123, [{
    id: 456,
    value: true
  }]);

  expect([{
    creditTrade: 123,
    hasAccepted: true,
    signingAuthorityAssertion: 456
  }]).toEqual(data);
});
