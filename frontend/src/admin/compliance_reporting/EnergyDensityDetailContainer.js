/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { energyDensities } from '../../actions/energyDensities';
import Loading from '../../app/components/Loading';
import EnergyDensityDetails from './components/EnergyDensityDetails';

class EnergyDensityDetailContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.getEnergyDensity(this.props.match.params.id);
  }

  render () {
    const { item, isFetching, success } = this.props.energyDensity;

    if (success && !isFetching && item) {
      return (
        <EnergyDensityDetails
          item={item}
          loggedInUser={this.props.loggedInUser}
          title="Energy Density Details"
        />
      );
    }

    return <Loading />;
  }
}

EnergyDensityDetailContainer.defaultProps = {
};

EnergyDensityDetailContainer.propTypes = {
  energyDensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getEnergyDensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  energyDensity: {
    isFetching: state.rootReducer.energyDensities.isFetching,
    item: state.rootReducer.energyDensities.item,
    success: state.rootReducer.energyDensities.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getEnergyDensity: energyDensities.get
};

export default connect(mapStateToProps, mapDispatchToProps)(EnergyDensityDetailContainer);
