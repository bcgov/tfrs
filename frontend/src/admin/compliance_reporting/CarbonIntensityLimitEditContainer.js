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
import CarbonIntensityLimitForm from './components/CarbonIntensityLimitForm';

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

  _handleSubmit (event) {
    event.preventDefault();

    return true;
  }

  render () {
    const { item, isFetching, success } = this.props.carbonIntensityLimit;

    if (success && !isFetching) {
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
          handleSubmit={event => this._handleSubmit(event, 'Approved')}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to update this Fuel code?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

CarbonIntensityLimitEditContainer.defaultProps = {
};

CarbonIntensityLimitEditContainer.propTypes = {
  carbonIntensityLimit: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getCarbonIntensityLimit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  carbonIntensityLimit: {
    isFetching: state.rootReducer.carbonIntensityLimit.isFetching,
    item: state.rootReducer.carbonIntensityLimit.item,
    success: state.rootReducer.carbonIntensityLimit.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getCarbonIntensityLimit: carbonIntensities.get
};

export default connect(mapStateToProps, mapDispatchToProps)(CarbonIntensityLimitEditContainer);
