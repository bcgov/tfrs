/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AdminTabs from '../components/AdminTabs';
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
    return ([
      <AdminTabs
        active="fuel-codes"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <FuelCodeForm
        addToFields={this._addToFields}
        errors={this.props.error}
        fields={this.state.fields}
        key="form"
        title="New Fuel Code"
      />
    ]);
  }
}

FuelCodeAddContainer.defaultProps = {
  error: {}
};

FuelCodeAddContainer.propTypes = {
  error: PropTypes.shape({}),
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodeAddContainer);
