/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import FuelCodesPage from './components/FuelCodesPage';

import { getFuelCodes } from '../../actions/fuelCodeActions';

class FuelCodesContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getFuelCodes();
  }

  render () {
    return (
      <FuelCodesPage
        fuelCodes={this.props.fuelCodes}
        loggedInUser={this.props.loggedInUser}
        title="Secure File Submissions"
      />
    );
  }
}

FuelCodesContainer.defaultProps = {
};

FuelCodesContainer.propTypes = {
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  getFuelCodes: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  fuelCodes: {
    isFetching: state.rootReducer.fuelCodes.isFetching,
    items: state.rootReducer.fuelCodes.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  getFuelCodes: bindActionCreators(getFuelCodes, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodesContainer);
