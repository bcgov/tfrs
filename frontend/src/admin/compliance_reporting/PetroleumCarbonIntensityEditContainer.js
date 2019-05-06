/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { petroleumCarbonIntensities } from '../../actions/petroleumCarbonIntensities';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import CarbonIntensityForm from './components/CarbonIntensityForm';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';
import toastr from '../../utils/toastr';

class PetroleumCarbonIntensityEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
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
    this.props.getPetroleumCarbonIntensity(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    if (this.props.carbonIntensity.isUpdating && !props.carbonIntensity.isUpdating) {
      if (props.carbonIntensity.success) {
        history.push(CREDIT_CALCULATIONS.LIST);
        toastr.fuelCodeSuccess(null, 'Carbon Intensity saved.');
      }
      return;
    }

    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    const { item } = props.carbonIntensity;

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
      density: this.state.fields.density !== '' ? this.state.fields.density : null,
      effectiveDate: this.state.fields.effectiveDate !== '' ? this.state.fields.effectiveDate : null
    };

    Object.entries(data).forEach((prop) => {
      if (prop[1] === null) {
        delete data[prop[0]];
      }
    });

    this.props.updatePetroleumCarbonIntensity({ id, state: data });

    return true;
  }

  render () {
    const { item, isFetching, success } = this.props.carbonIntensity;
    const updating = this.props.carbonIntensity.isUpdating;

    if (!updating && success && (!isFetching)) {
      return ([
        <CarbonIntensityForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          item={item}
          key="carbon-intensity-limit-form"
          loggedInUser={this.props.loggedInUser}
          title="Edit Carbon Intensity Details"
        />,
        <Modal
          handleSubmit={event => this._handleSubmit(event)}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to update the carbon intensity?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

PetroleumCarbonIntensityEditContainer.defaultProps = {
};

PetroleumCarbonIntensityEditContainer.propTypes = {
  carbonIntensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getPetroleumCarbonIntensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updatePetroleumCarbonIntensity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  carbonIntensity: {
    isFetching: state.rootReducer.petroleumCarbonIntensities.isGetting,
    isUpdating: state.rootReducer.petroleumCarbonIntensities.isUpdating,
    item: state.rootReducer.petroleumCarbonIntensities.item,
    success: state.rootReducer.petroleumCarbonIntensities.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getPetroleumCarbonIntensity: petroleumCarbonIntensities.get,
  updatePetroleumCarbonIntensity: petroleumCarbonIntensities.update
};

export default connect(mapStateToProps, mapDispatchToProps)(PetroleumCarbonIntensityEditContainer);
