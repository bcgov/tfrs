/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from '../../app/components/Loading';

import { getFuelCode } from '../../actions/fuelCodeActions';
import FuelCodeDetails from './components/FuelCodeDetails';

class FuelCodeDetailContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.getFuelCode(id);
  }

  render () {
    const {
      errors, item, isFetching, success
    } = this.props.fuelCode;

    if (isFetching) {
      return <Loading />;
    }

    if (success || (!isFetching && Object.keys(errors).length > 0)) {
      return (
        <FuelCodeDetails
          errors={errors}
          item={item}
        />
      );
    }

    return <Loading />;
  }
}

FuelCodeDetailContainer.defaultProps = {
};

FuelCodeDetailContainer.propTypes = {
  fuelCode: PropTypes.shape({
    errors: PropTypes.shape(),
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number
    }),
    success: PropTypes.bool
  }).isRequired,
  getFuelCode: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  fuelCode: {
    errors: state.rootReducer.fuelCode.errors,
    isFetching: state.rootReducer.fuelCode.isFetching,
    item: state.rootReducer.fuelCode.item,
    success: state.rootReducer.fuelCode.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getFuelCode: bindActionCreators(getFuelCode, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FuelCodeDetailContainer);
