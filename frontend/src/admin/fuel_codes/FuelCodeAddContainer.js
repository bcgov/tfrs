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
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import FuelCodeForm from './components/FuelCodeForm';
import { FUEL_CODES } from '../../constants/routes/Admin';
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
        feedstockMisc: '',
        feedstockTransportMode: [],
        formerCompany: '',
        fuel: '',
        fuelCode: '',
        fuelTransportMode: []
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
    const { name } = event.target;
    let { value } = event.target;

    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      fieldState[name] = [...event.target.options].filter(o => o.selected).map(o => o.value);
      this.setState({
        fields: fieldState
      });
    } else {
      if (name === 'facilityNameplate') {
        // as you're typing remove non-numeric values
        // (this is so we don't mess our count, but we'll add commas later)
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }

      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status = 'Draft') {
    event.preventDefault();

    const fuelCode = this.state.fields.fuelCode.split('.');

    // API data structure
    const data = {
      applicationDate: this.state.fields.applicationDate !== '' ? this.state.fields.applicationDate : null,
      approvalDate: this.state.fields.approvalDate !== '' ? this.state.fields.approvalDate : null,
      carbonIntensity: this.state.fields.carbonIntensity,
      company: this.state.fields.company,
      effectiveDate: this.state.fields.effectiveDate !== '' ? this.state.fields.effectiveDate : null,
      expiryDate: this.state.fields.expiryDate !== '' ? this.state.fields.expiryDate : null,
      facilityLocation: this.state.fields.facilityLocation,
      facilityNameplate: this.state.fields.facilityNameplate !== '' ? this.state.fields.facilityNameplate.replace(/\D/g, '') : null,
      feedstock: this.state.fields.feedstock,
      feedstockLocation: this.state.fields.feedstockLocation,
      feedstockMisc: this.state.fields.feedstockMisc,
      feedstockTransportMode: this.state.fields.feedstockTransportMode,
      formerCompany: this.state.fields.formerCompany,
      fuel: this.state.fields.fuel,
      fuelCode: 'BCLCF',
      fuelCodeVersion: fuelCode.length > 0 ? fuelCode[0] : null,
      fuelCodeVersionMinor: fuelCode.length > 1 ? fuelCode[1] : null,
      fuelTransportMode: this.state.fields.fuelTransportMode,
      status: this._getFuelCodeStatus(status).id
    };

    Object.entries(data).forEach((prop) => {
      if (prop[1] === null) {
        delete data[prop[0]];
      }
    });

    this.props.addFuelCode(data).then((response) => {
      history.push(FUEL_CODES.LIST);
      toastr.fuelCodeSuccess(status);
    });

    return true;
  }

  render () {
    if (this.props.referenceData.isFetching ||
      !this.props.referenceData.isSuccessful) {
      return (<Loading />);
    }

    return ([
      <FuelCodeForm
        addToFields={this._addToFields}
        approvedFuels={this.props.referenceData.approvedFuels}
        errors={this.props.errors}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="form"
        title="New Fuel Code"
        transportModes={this.props.referenceData.transportModes}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event, 'Approved')}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this Fuel code?
      </Modal>
    ]);
  }
}

FuelCodeAddContainer.defaultProps = {
  errors: {}
};

FuelCodeAddContainer.propTypes = {
  addFuelCode: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
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
    approvedFuels: PropTypes.arrayOf(PropTypes.shape),
    transportModes: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.fuelCode.errors,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    fuelCodeStatuses: state.rootReducer.referenceData.data.fuelCodeStatuses,
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels,
    transportModes: state.rootReducer.referenceData.data.transportModes,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  addFuelCode: bindActionCreators(addFuelCode, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodeAddContainer);
