import React from 'react';
import renderer from 'react-test-renderer';

import Tooltip from '../../../src/app/components/Tooltip';

test('Tooltip should display properly', () => {
  const component = renderer.create([
    <Tooltip
      key="tooltip"
      show
      title="Sample Title"
    >
      <button type="button">Test Button</button>
    </Tooltip>
  ]);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
