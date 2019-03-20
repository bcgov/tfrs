/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getFuelCode, updateFuelCode } from '../../actions/fuelCodeActions';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import FuelCodeForm from './components/FuelCodeForm';
import { FUEL_CODES } from '../../constants/routes/Admin';
import toastr from '../../utils/toastr';

class FuelCodeEditContainer extends Component {
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

    this.loaded = false;

    this._addToFields = this._addToFields.bind(this);
    this._getFuelCodeStatus = this._getFuelCodeStatus.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  loadData (id) {
    this.props.getFuelCode(id);
  }

  loadPropsToFieldState (props) {
    const { item } = props.fuelCode;

    if (Object.keys(item).length > 0 && !this.loaded) {
      const fieldState = {
        applicationDate: item.applicationDate,
        approvalDate: item.approvalDate,
        carbonIntensity: item.carbonIntensity,
        company: item.company,
        effectiveDate: item.effectiveDate,
        expiryDate: item.expiryDate,
        facilityLocation: item.facilityLocation,
        facilityNameplate: item.facilityNameplate,
        feedstock: item.feedstock,
        feedstockLocation: item.feedstockLocation,
        feedstockMisc: item.feedstockMisc,
        feedstockTransportMode: item.feedstockTransportMode,
        formerCompany: item.formerCompany,
        fuel: item.fuel,
        fuelCode: (item.fuelCode.indexOf('BCLCF') >= 0) ? item.fuelCode.replace(/BCLCF/g, '') : item.fuelCode,
        fuelTransportMode: item.fuelTransportMode
      };

      this.setState({
        fields: fieldState
      });

      this.loaded = true;
    }
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

    const { id } = this.props.fuelCode.item;

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

    this.props.updateFuelCode(id, data).then((response) => {
      history.push(FUEL_CODES.LIST);
      toastr.fuelCodeSuccess(status);
    });

    return true;
  }

  render () {
    const {
      errors, isFetching, success
    } = this.props.fuelCode;

    if (isFetching || this.props.referenceData.isFetching ||
      !this.props.referenceData.isSuccessful) {
      return <Loading />;
    }

    if (success || (!isFetching && Object.keys(errors).length > 0)) {
      return ([
        <FuelCodeForm
          addToFields={this._addToFields}
          errors={this.props.error}
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          transportModes={this.props.referenceData.transportModes}
          approvedFuels={this.props.referenceData.approvedFuels}
          key="form"
          title="Edit Fuel Code"
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

    return <Loading />;
  }
}

FuelCodeEditContainer.defaultProps = {
  error: {}
};

FuelCodeEditContainer.propTypes = {
  error: PropTypes.shape({}),
  fuelCode: PropTypes.shape({
    errors: PropTypes.shape(),
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number
    }),
    success: PropTypes.bool
  }).isRequired,
  getFuelCode: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  referenceData: PropTypes.shape({
    fuelCodeStatuses: PropTypes.arrayOf(PropTypes.shape),
    approvedFuels: PropTypes.arrayOf(PropTypes.shape),
    transportModes: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  updateFuelCode: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fuelCode: {
    errors: state.rootReducer.fuelCode.errors,
    isFetching: state.rootReducer.fuelCode.isFetching,
    item: state.rootReducer.fuelCode.item,
    success: state.rootReducer.fuelCode.success
  },
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
  getFuelCode: bindActionCreators(getFuelCode, dispatch),
  updateFuelCode: bindActionCreators(updateFuelCode, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FuelCodeEditContainer);
