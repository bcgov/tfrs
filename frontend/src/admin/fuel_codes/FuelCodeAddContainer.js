/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FuelCodeForm from './components/FuelCodeForm';

class FuelCodeAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        applicationDate: '',
        approvalDate: '',
        carbonIntensity: '',
        company: '',
        effectiveDate: '',
        expiryDate: '',
        facilityLocation: '',
        facilityNameplate: '',
        feedstock: '',
        feedstockLocation: '',
        feedstockMiscellaneous: '',
        feedstockTransportMode: '',
        formerCompanyName: '',
        fuel: '',
        fuelCode: '',
        fuelTransportMode: ''
      }
    };

    this._addToFields = this._addToFields.bind(this);
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    const found = this.state.fields.terms.find(term => term.id === value.id);

    if (!found) {
      fieldState.terms.push(value);
    }

    this.setState({
      fields: fieldState
    });
  }

  render () {
    return (
      <FuelCodeForm
        addToFields={this._addToFields}
        fields={this.state.fields}
        errors={this.props.error}
        title="New Fuel Code"
      />
    );
  }
}

FuelCodeAddContainer.defaultProps = {
  error: {}
};

FuelCodeAddContainer.propTypes = {
  error: PropTypes.shape({})
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodeAddContainer);
