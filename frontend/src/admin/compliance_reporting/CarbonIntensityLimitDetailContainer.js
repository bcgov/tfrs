/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { carbonIntensities } from '../../actions/carbonIntensities';
import Loading from '../../app/components/Loading';
import CarbonIntensityLimitDetails from './components/CarbonIntensityLimitDetails';

class CarbonIntensityLimitDetailContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.getCarbonIntensityLimit(this.props.match.params.id);
  }

  render () {
    // const { item, isFetching, success } = this.props.carbonIntensityLimit;
    const { items, isFetching, success } = this.props.carbonIntensityLimits;

    if (success && !isFetching) {
      const { id } = this.props.match.params;
      const item = items.find(ele => ele.id == id);

      return (
        <CarbonIntensityLimitDetails
          item={item}
          loggedInUser={this.props.loggedInUser}
          title="Carbon Intensity Limit Details"
        />
      );
    }

    return <Loading />;
  }
}

CarbonIntensityLimitDetailContainer.defaultProps = {
};

CarbonIntensityLimitDetailContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CarbonIntensityLimitDetailContainer);
