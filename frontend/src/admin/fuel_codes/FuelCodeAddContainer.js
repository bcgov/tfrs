/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addFuelCode } from '../../actions/fuelCodeActions';

import history from '../../app/History';
import AdminTabs from '../components/AdminTabs';
import FuelCodeForm from './components/FuelCodeForm';
import toastr from '../../utils/toastr';

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
        formerCompany: '',
        fuel: '',
        fuelCode: '',
        fuelTransportMode: ''
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._getFuelCodeStatus = this._getFuelCodeStatus.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
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

  _getFuelCodeStatus (status) {
    return this.props.referenceData.fuelCodeStatuses.find(fuelCodeStatus =>
      (fuelCodeStatus.status === status));
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status = 'Draft') {
    event.preventDefault();

    // API data structure
    const data = {
      applicationDate: this.state.fields.applicationDate,
      approvalDate: this.state.fields.approvalDate,
      carbonIntensity: this.state.fields.carbonIntensity,
      company: this.state.fields.company,
      effectiveDate: this.state.fields.effectiveDate,
      expiryDate: this.state.fields.expiryDate,
      facilityLocation: this.state.fields.facilityLocation,
      facilityNameplate: this.state.fields.facilityNameplate,
      feedstock: this.state.fields.feedstock,
      feedstockLocation: this.state.fields.feedstockLocation,
      feedstockMiscellaneous: this.state.fields.feedstockMiscellaneous,
      feedstockTransportMode: this.state.fields.feedstockTransportMode,
      formerCompany: this.state.fields.formerCompany,
      fuel: this.state.fields.fuel,
      fuelCode: this.state.fields.fuelCode,
      fuelTransportMode: this.state.fields.fuelTransportMode,
      status: this._getFuelCodeStatus(status).id
    };

    this.props.addFuelCode(data).then((response) => {
      // history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', response.data.id));
      toastr.fuelCodeSuccess(status, data);
    });

    return true;
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
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
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
  addFuelCode: PropTypes.func.isRequired,
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
  }).isRequired,
  referenceData: PropTypes.shape({
    fuelCodeStatuses: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    fuelCodeStatuses: state.rootReducer.referenceData.data.fuelCodeStatuses,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  addFuelCode: bindActionCreators(addFuelCode, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodeAddContainer);
