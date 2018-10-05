/*
eslint class-methods-use-this: [
  "error", {
    "exceptMethods": ["renderItem"]
  }
]
*/

import React from 'react';
import { ItemAdapter } from 'react-bootstrap-autosuggest';

class FuelSupplierAdapter extends ItemAdapter {
  renderItem (item) {
    return <div>{item.name}</div>;
  }
}

export default FuelSupplierAdapter;
