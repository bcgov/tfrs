/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { defaultCarbonIntensities } from '../../actions/defaultCarbonIntensities';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import CarbonIntensityForm from './components/CarbonIntensityForm';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';
import toastr from '../../utils/toastr';

class DefaultCarbonIntensityEditContainer extends Component {
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
    this.props.getDefaultCarbonIntensity(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    if (this.props.defaultCarbonIntensity.isUpdating && !props.defaultCarbonIntensity.isUpdating) {
      if (props.defaultCarbonIntensity.success) {
        history.push(CREDIT_CALCULATIONS.LIST);
        toastr.fuelCodeSuccess(null, 'Default Carbon Intensity saved.');
      }
      return;
    }

    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    const { item } = props.defaultCarbonIntensity;

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

    this.props.updateDefaultCarbonIntensity({ id, state: data });

    return true;
  }

  render () {
    const { item, isFetching, success } = this.props.defaultCarbonIntensity;
    const updating = this.props.defaultCarbonIntensity.isUpdating;

    if (!updating && success && (!isFetching)) {
      return ([
        <CarbonIntensityForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          item={item}
          key="carbon-intensity-limit-form"
          loggedInUser={this.props.loggedInUser}
          title="Edit Default Carbon Intensity Details"
        />,
        <Modal
          handleSubmit={event => this._handleSubmit(event)}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to update the default carbon intensity?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

DefaultCarbonIntensityEditContainer.defaultProps = {
};

DefaultCarbonIntensityEditContainer.propTypes = {
  defaultCarbonIntensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getDefaultCarbonIntensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateDefaultCarbonIntensity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  defaultCarbonIntensity: {
    isFetching: state.rootReducer.defaultCarbonIntensities.isGetting,
    isUpdating: state.rootReducer.defaultCarbonIntensities.isUpdating,
    item: state.rootReducer.defaultCarbonIntensities.item,
    success: state.rootReducer.defaultCarbonIntensities.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getDefaultCarbonIntensity: defaultCarbonIntensities.get,
  updateDefaultCarbonIntensity: defaultCarbonIntensities.update
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultCarbonIntensityEditContainer);
