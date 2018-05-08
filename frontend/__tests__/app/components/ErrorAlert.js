import React from 'react';
import renderer from 'react-test-renderer';

import ErrorAlert from '../../../src/app/components/ErrorAlert';

test('ErrorAlert should display the title and message as expected', () => {
  const component = renderer.create(<ErrorAlert title="Title" message="Message" />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
