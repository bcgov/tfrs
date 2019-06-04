/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { energyDensities } from '../../actions/energyDensities';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import EnergyDensityForm from './components/EnergyDensityForm';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';
import toastr from '../../utils/toastr';

class EnergyDensityEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      updateCompleted: false,
      fields: {
        density: '',
        effectiveDate: '',
        expirationDate: ''
      }
    };

    this.loaded = false;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.getEnergyDensity(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    if (this.props.energyDensity.isUpdating && !props.energyDensity.isUpdating) {
      if (props.energyDensity.success) {
        history.push(CREDIT_CALCULATIONS.LIST);
        toastr.fuelCodeSuccess(null, 'Energy densities saved.');
      }
      return;
    }

    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    const { item } = props.energyDensity;

    if (item && !this.loaded) {
      const fieldState = {
        density: `${item.density.density}` || '',
        effectiveDate: item.density.effectiveDate || '',
        expirationDate: item.density.expirationDate || ''
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
      density: this.state.fields.density !== '' ? this.state.fields.density : null,
      effectiveDate: this.state.fields.effectiveDate !== '' ? this.state.fields.effectiveDate : null
    };

    Object.entries(data).forEach((prop) => {
      if (prop[1] === null) {
        delete data[prop[0]];
      }
    });

    this.props.updateEnergyDensity({ id, state: data });

    return true;
  }

  render () {
    const { item, isFetching, success } = this.props.energyDensity;
    const updating = this.props.energyDensity.isUpdating;

    if (!updating && success && (!isFetching)) {
      return ([
        <EnergyDensityForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          item={item}
          key="energy-density-form"
          loggedInUser={this.props.loggedInUser}
          title="Edit Energy Density Details"
        />,
        <Modal
          handleSubmit={event => this._handleSubmit(event)}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to update the energy density?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

EnergyDensityEditContainer.defaultProps = {};

EnergyDensityEditContainer.propTypes = {
  energyDensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getEnergyDensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateEnergyDensity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  energyDensity: {
    isFetching: state.rootReducer.energyDensities.isGetting,
    isUpdating: state.rootReducer.energyDensities.isUpdating,
    item: state.rootReducer.energyDensities.item,
    success: state.rootReducer.energyDensities.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getEnergyDensity: energyDensities.get,
  updateEnergyDensity: energyDensities.update
};

export default connect(mapStateToProps, mapDispatchToProps)(EnergyDensityEditContainer);
