/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { carbonIntensities } from '../../actions/carbonIntensities';
import Loading from '../../app/components/Loading';
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
  }

  componentDidMount () {
    this.props.getCarbonIntensityLimit(this.props.match.params.id);
  }

  loadPropsToFieldState (props) {
    // const { item } = props.carbonIntensity;
    const { items } = this.props.carbonIntensityLimits;
    const { id } = this.props.match.params;
    const item = items.find(ele => ele.id == id);

    if (Object.keys(item).length > 0 && !this.loaded) {
      const fieldState = {
        dieselCarbonIntensity: item.limits ? item.limits.diesel.density : '',
        dieselEffectiveDate: item.limits ? item.limits.diesel.effectiveDate : '',
        dieselExpirationDate: item.limits ? item.limits.diesel.expirationDate : '',
        gasolineCarbonIntensity: item.limits ? item.limits.gasoline.density : '',
        gasolineEffectiveDate: item.limits ? item.limits.gasoline.effectiveDate : '',
        gasolineExpirationDate: item.limits ? item.limits.gasoline.expirationDate : ''
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
    // const { item, isFetching, success } = this.props.carbonIntensityLimit;
    const { items, isFetching, success } = this.props.carbonIntensityLimits;

    if (success && !isFetching) {
      const { id } = this.props.match.params;
      const item = items.find(ele => ele.id == id);

      return (
        <CarbonIntensityLimitForm
          item={item}
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          loggedInUser={this.props.loggedInUser}
          title="Edit Carbon Intensity Limit Details"
        />
      );
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
    isFetching: state.rootReducer.carbonIntensityLimits.isFetching,
    item: state.rootReducer.carbonIntensityLimits.item,
    success: state.rootReducer.carbonIntensityLimits.success
  },
  carbonIntensityLimits: {
    isFetching: state.rootReducer.carbonIntensityLimits.isFetching,
    items: state.rootReducer.carbonIntensityLimits.items,
    success: state.rootReducer.carbonIntensityLimits.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getCarbonIntensityLimit: carbonIntensities.find
};

export default connect(mapStateToProps, mapDispatchToProps)(CarbonIntensityLimitEditContainer);
