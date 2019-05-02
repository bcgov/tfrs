/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { carbonIntensities } from '../../actions/carbonIntensities';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import CarbonIntensityLimitForm from './components/CarbonIntensityLimitForm';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';
import toastr from '../../utils/toastr';

class CarbonIntensityLimitEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        dieselCarbonIntensity: '',
        dieselEffectiveDate: '',
        dieselExpirationDate: '',
        gasolineCarbonIntensity: '',
        gasolineEffectiveDate: '',
        gasolineExpirationDate: ''
      }
    };

    this.loaded = false;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.getCarbonIntensityLimit(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    if (this.props.carbonIntensityLimit.isUpdating && !props.carbonIntensityLimit.isUpdating) {
      if (props.carbonIntensityLimit.success) {
        history.push(CREDIT_CALCULATIONS.LIST);
        toastr.fuelCodeSuccess(null, 'Carbon intensity limits saved.');
      }

      return;
    }

    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    const { item } = props.carbonIntensityLimit;

    if (item && !this.loaded) {
      const fieldState = {
        dieselCarbonIntensity: item.limits.diesel ? `${item.limits.diesel.density}` : '',
        dieselEffectiveDate: item.limits.diesel ? item.limits.diesel.effectiveDate : '',
        dieselExpirationDate: item.limits.diesel ? item.limits.diesel.expirationDate : '',
        gasolineCarbonIntensity: item.limits.gasoline ? `${item.limits.gasoline.density}` : '',
        gasolineEffectiveDate: item.limits.gasoline ? item.limits.gasoline.effectiveDate : '',
        gasolineExpirationDate: item.limits.gasoline ? item.limits.gasoline.expirationDate : ''
      };

      this.setState({
        fields: fieldState
      });

      this.loaded = true;
    }
  }

  _handleInputChange (event) {
    const { name, value } = event.target;
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

  _handleSubmit (event, status = 'Submitted') {
    event.preventDefault();

    const { id } = this.props.match.params;

    // API data structure
    const data = {
      dieselCarbonIntensity: this.state.fields.dieselCarbonIntensity !== '' ? this.state.fields.dieselCarbonIntensity : null,
      dieselEffectiveDate: this.state.fields.dieselEffectiveDate !== '' ? this.state.fields.dieselEffectiveDate : null,
      gasolineCarbonIntensity: this.state.fields.gasolineCarbonIntensity !== '' ? this.state.fields.gasolineCarbonIntensity : null,
      gasolineEffectiveDate: this.state.fields.gasolineEffectiveDate !== '' ? this.state.fields.gasolineEffectiveDate : null
    };

    Object.entries(data).forEach((prop) => {
      if (prop[1] === null) {
        delete data[prop[0]];
      }
    });

    this.props.updateCarbonIntensityLimit({ id, state: data });

    return true;
  }

  render () {
    const { item, isFetching, success } = this.props.carbonIntensityLimit;
    const updating = this.props.carbonIntensityLimit.isUpdating;

    if (!updating && success && (!isFetching)) {
      return ([
        <CarbonIntensityLimitForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          item={item}
          key="carbon-intensity-limit-form"
          loggedInUser={this.props.loggedInUser}
          title="Edit Carbon Intensity Limit Details"
        />,
        <Modal
          handleSubmit={event => this._handleSubmit(event)}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to update the prescribed carbon intensity limits?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

CarbonIntensityLimitEditContainer.defaultProps = {};

CarbonIntensityLimitEditContainer.propTypes = {
  carbonIntensityLimit: PropTypes.shape({
    isFetching: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getCarbonIntensityLimit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateCarbonIntensityLimit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  carbonIntensityLimit: {
    isFetching: state.rootReducer.carbonIntensityLimits.isGetting,
    isUpdating: state.rootReducer.carbonIntensityLimits.isUpdating,
    item: state.rootReducer.carbonIntensityLimits.item,
    success: state.rootReducer.carbonIntensityLimits.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getCarbonIntensityLimit: carbonIntensities.get,
  updateCarbonIntensityLimit: carbonIntensities.update
};

export default connect(mapStateToProps, mapDispatchToProps)(CarbonIntensityLimitEditContainer);
