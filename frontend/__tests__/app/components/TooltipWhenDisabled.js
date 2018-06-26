import React from 'react';
import renderer from 'react-test-renderer';

import TooltipWhenDisabled from '../../../src/app/components/TooltipWhenDisabled';

test('TooltipWhenDisabled should display properly', () => {
  const component = renderer.create([
    <TooltipWhenDisabled
      disabled
      key="tooltip"
      title="Sample Title"
    >
      <button type="button">Test Button</button>
    </TooltipWhenDisabled>
  ]);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
