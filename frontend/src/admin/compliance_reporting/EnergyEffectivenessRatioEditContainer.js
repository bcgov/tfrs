/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { energyEffectivenessRatios } from '../../actions/energyEffectivenessRatios';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import EnergyEffectivenessRatioForm from './components/EnergyEffectivenessRatioForm';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';
import toastr from '../../utils/toastr';

class EnergyEffectivenessRatioEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        dieselEffectiveDate: '',
        dieselExpirationDate: '',
        dieselRatio: '',
        gasolineEffectiveDate: '',
        gasolineExpirationDate: '',
        gasolineRatio: ''
      }
    };

    this.loaded = false;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.getEnergyEffectivenessRatio(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    if (this.props.energyEffectivenessRatio.isUpdating &&
      !props.energyEffectivenessRatio.isUpdating) {
      if (this.props.energyEffectivenessRatio.success) {
        history.push(CREDIT_CALCULATIONS.LIST);
        toastr.fuelCodeSuccess(null, 'Energy effectiveness ratios saved.');
      }

      return;
    }

    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    const { item } = props.energyEffectivenessRatio;

    if (item && !this.loaded) {
      const fieldState = {
        dieselEffectiveDate: item.ratios.diesel.effectiveDate || '',
        dieselExpirationDate: item.ratios.diesel.expirationDate || '',
        dieselRatio: `${item.ratios.diesel.ratio}` || '',
        gasolineEffectiveDate: item.ratios.gasoline.effectiveDate || '',
        gasolineExpirationDate: item.ratios.gasoline.expirationDate || '',
        gasolineRatio: `${item.ratios.gasoline.ratio}` || ''
      };

      this.setState({
        fields: fieldState
      });

      this.loaded = true;
    }
  }

  _handleInputChange (event) {
    const { name } = event.target;
    const { value } = event.target;
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
      dieselEffectiveDate: this.state.fields.dieselEffectiveDate !== '' ? this.state.fields.dieselEffectiveDate : null,
      dieselRatio: this.state.fields.dieselRatio !== '' ? this.state.fields.dieselRatio : null,
      gasolineEffectiveDate: this.state.fields.gasolineEffectiveDate !== '' ? this.state.fields.gasolineEffectiveDate : null,
      gasolineRatio: this.state.fields.gasolineRatio !== '' ? this.state.fields.gasolineRatio : null
    };

    Object.entries(data).forEach((prop) => {
      if (prop[1] === null || prop[1] === 'null') {
        delete data[prop[0]];
      }
    });

    this.props.updateEnergyEffectivenessRatio({ id, state: data });

    return true;
  }

  render () {
    const { item, isFetching, success } = this.props.energyEffectivenessRatio;
    const updating = this.props.energyEffectivenessRatio.isUpdating;

    if (!updating && success && (!isFetching)) {
      return ([
        <EnergyEffectivenessRatioForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          item={item}
          key="energy-effectiveness-ratio-form"
          loggedInUser={this.props.loggedInUser}
          title="Edit Energy Effectiveness Ratios"
        />,
        <Modal
          handleSubmit={event => this._handleSubmit(event)}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to update the energy effectiveness ratio(s)?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

EnergyEffectivenessRatioEditContainer.defaultProps = {
};

EnergyEffectivenessRatioEditContainer.propTypes = {
  energyEffectivenessRatio: PropTypes.shape({
    isFetching: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getEnergyEffectivenessRatio: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateEnergyEffectivenessRatio: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  energyEffectivenessRatio: {
    isFetching: state.rootReducer.energyEffectivenessRatios.isGetting,
    isUpdating: state.rootReducer.energyEffectivenessRatios.isUpdating,
    item: state.rootReducer.energyEffectivenessRatios.item,
    success: state.rootReducer.energyEffectivenessRatios.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getEnergyEffectivenessRatio: energyEffectivenessRatios.get,
  updateEnergyEffectivenessRatio: energyEffectivenessRatios.update
};

export default connect(mapStateToProps, mapDispatchToProps)(EnergyEffectivenessRatioEditContainer);
