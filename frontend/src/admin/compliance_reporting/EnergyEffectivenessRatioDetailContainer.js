/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { energyEffectivenessRatios } from '../../actions/energyEffectivenessRatios';
import Loading from '../../app/components/Loading';
import EnergyEffectivenessRatioDetails from './components/EnergyEffectivenessRatioDetails';

class EnergyEffectivenessRatioDetailContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.getEnergyEffectivenessRatio(this.props.match.params.id);
  }

  render () {
    const { item, isFetching, success } = this.props.energyEffectivenessRatio;

    if (success && !isFetching && item) {
      return (
        <EnergyEffectivenessRatioDetails
          item={item}
          loggedInUser={this.props.loggedInUser}
          title="Energy Effectiveness Ratio Details"
        />
      );
    }

    return <Loading />;
  }
}

EnergyEffectivenessRatioDetailContainer.defaultProps = {
};

EnergyEffectivenessRatioDetailContainer.propTypes = {
  energyEffectivenessRatio: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getEnergyEffectivenessRatio: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  energyEffectivenessRatio: {
    isFetching: state.rootReducer.energyEffectivenessRatios.isGetting,
    item: state.rootReducer.energyEffectivenessRatios.item,
    success: state.rootReducer.energyEffectivenessRatios.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getEnergyEffectivenessRatio: energyEffectivenessRatios.get
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnergyEffectivenessRatioDetailContainer);
