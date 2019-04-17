/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { defaultCarbonIntensities } from '../../actions/defaultCarbonIntensities';
import Loading from '../../app/components/Loading';
import DefaultCarbonIntensityDetails from './components/DefaultCarbonIntensityDetails';

class DefaultCarbonIntensityDetailContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.getDefaultCarbonIntensity(this.props.match.params.id);
  }

  render () {
    const { item, isFetching, success } = this.props.defaultCarbonIntensity;

    if (success && !isFetching && item) {
      return (
        <DefaultCarbonIntensityDetails
          item={item}
          loggedInUser={this.props.loggedInUser}
          title="Default Carbon Intensity Details"
        />
      );
    }

    return <Loading />;
  }
}

DefaultCarbonIntensityDetailContainer.defaultProps = {
};

DefaultCarbonIntensityDetailContainer.propTypes = {
  defaultCarbonIntensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getDefaultCarbonIntensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  defaultCarbonIntensity: {
    isFetching: state.rootReducer.defaultCarbonIntensity.isFetching,
    item: state.rootReducer.defaultCarbonIntensity.item,
    success: state.rootReducer.defaultCarbonIntensity.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getDefaultCarbonIntensity: defaultCarbonIntensities.get
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultCarbonIntensityDetailContainer);
