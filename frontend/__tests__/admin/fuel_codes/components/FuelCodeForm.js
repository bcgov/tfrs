import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import FuelCodeForm from '../../../../src/admin/fuel_codes/components/FuelCodeForm';
import store from '../../../../src/store/store';

describe('Test Fuel Code Form', () => {
  const approvedFuels = [{
    name: 'LNG'
  }, {
    name: 'Propane'
  }];
  const errors = {};
  const fields = {};
  const transportModes = [{
    name: 'Truck'
  }, {
    name: 'Rail'
  }];

  const component = renderer.create(
    <Provider store={store}>
      <FuelCodeForm
        addToFields={() => {}}
        approvedFuels={approvedFuels}
        errors={errors}
        fields={fields}
        handleInputChange={() => {}}
        handleSubmit={() => {}}
        title="Edit Fuel"
        transportModes={transportModes}
      />
    </Provider>
  );

  test('FuelCodeForm should display', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Click on the Submit button', () => {
    const { root } = renderer.create(
      <Provider store={store}>
        <FuelCodeForm
          addToFields={() => {}}
          approvedFuels={approvedFuels}
          errors={errors}
          fields={fields}
          handleInputChange={() => {}}
          handleSubmit={() => {}}
          title="Edit Fuel"
          transportModes={transportModes}
        />
      </Provider>
    );
    console.log(root.instance);
    root.instance.find('button.btn-primary').click();
    // console.log(renderer.root.inst);
  });
});
