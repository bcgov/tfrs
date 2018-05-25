import React from 'react';
import renderer from 'react-test-renderer';

import CheckBox from '../../../src/app/components/CheckBox';

test('CheckBox should display properly and add the field to "fields"', () => {
  const fields = [];

  const addToFields = (field) => {
    fields.push(field);
  };

  const toggleCheck = () => {
  };

  const component = renderer.create(<CheckBox
    addToFields={addToFields}
    fields={fields}
    id={1}
    toggleCheck={toggleCheck}
  />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  expect(fields).toEqual([{
    id: 1,
    value: false
  }]);
});
