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
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import FUEL_CODES from '../../constants/routes/FuelCodes';
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
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      fieldState[name] = [...event.target.options].filter(o => o.selected).map(o => o.value);
      this.setState({
        fields: fieldState
      });
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
      feedstockMisc: this.state.fields.feedstockMisc,
      feedstockTransportMode: this.state.fields.feedstockTransportMode,
      formerCompany: this.state.fields.formerCompany,
      fuel: this.state.fields.fuel,
      fuelCode: `BCLCF${this.state.fields.fuelCode}`,
      fuelTransportMode: this.state.fields.fuelTransportMode,
      status: this._getFuelCodeStatus(status).id
    };

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
        transportModes={this.props.referenceData.transportModes}
        approvedFuels={this.props.referenceData.approvedFuels}
        key="form"
        title="New Fuel Code"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, 'Submitted');
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this Fuel code?
      </Modal>
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
    approvedFuels: PropTypes.arrayOf(PropTypes.shape),
    transportModes: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
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
