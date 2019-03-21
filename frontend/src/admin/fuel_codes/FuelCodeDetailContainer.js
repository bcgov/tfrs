/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from '../../app/components/Loading';

import { deleteFuelCode, getFuelCode } from '../../actions/fuelCodeActions';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import FuelCodeDetails from './components/FuelCodeDetails';
import { FUEL_CODES } from '../../constants/routes/Admin';
import toastr from '../../utils/toastr';

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

  _getFuelCodeStatus (status) {
    return this.props.referenceData.fuelCodeStatuses.find(fuelCodeStatus =>
      (fuelCodeStatus.status === status));
  }

  _handleDelete (event) {
    event.preventDefault();

    const { id } = this.props.fuelCode.item;

    this.props.deleteFuelCode(id).then(() => {
      history.push(FUEL_CODES.LIST);
      toastr.fuelCodeSuccess('Cancelled');
    });

    return true;
  }

  render () {
    const {
      errors, item, isFetching, success
    } = this.props.fuelCode;

    if (isFetching) {
      return <Loading />;
    }

    if (success || (!isFetching && Object.keys(errors).length > 0)) {
      return ([
        <FuelCodeDetails
          errors={errors}
          item={item}
          key="fuel-code-details"
        />,
        <Modal
          handleSubmit={event => this._handleDelete(event)}
          id="confirmDelete"
          key="confirm-delete"
        >
          Are you sure you want to delete this draft?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

FuelCodeDetailContainer.defaultProps = {
};

FuelCodeDetailContainer.propTypes = {
  deleteFuelCode: PropTypes.func.isRequired,
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
  }).isRequired,
  referenceData: PropTypes.shape({
    fuelCodeStatuses: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

const mapStateToProps = state => ({
  fuelCode: {
    errors: state.rootReducer.fuelCode.errors,
    isFetching: state.rootReducer.fuelCode.isFetching,
    item: state.rootReducer.fuelCode.item,
    success: state.rootReducer.fuelCode.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    fuelCodeStatuses: state.rootReducer.referenceData.data.fuelCodeStatuses
  }
});

const mapDispatchToProps = dispatch => ({
  deleteFuelCode: bindActionCreators(deleteFuelCode, dispatch),
  getFuelCode: bindActionCreators(getFuelCode, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FuelCodeDetailContainer);
