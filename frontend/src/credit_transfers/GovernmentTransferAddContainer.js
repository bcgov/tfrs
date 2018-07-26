/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GovernmentTransferForm from './components/GovernmentTransferForm';
import Modal from '../app/components/Modal';
import history from '../app/History';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import { getFuelSuppliers } from '../actions/organizationActions';
import {
  addCommentToCreditTransfer,
  addCreditTransfer,
  invalidateCreditTransfer,
  invalidateCreditTransfers
} from '../actions/creditTransfersActions';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS, DEFAULT_ORGANIZATION } from '../constants/values';

class GovernmentTransferAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        comment: '',
        compliancePeriod: {},
        numberOfCredits: '',
        respondent: {},
        transferType: ''
      }
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.invalidateCreditTransfer();
    this.props.getCompliancePeriods();
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    const fieldState = { ...this.state.fields };

    this.setState({
      fields: fieldState
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    const { comment } = this.state.fields;

    // API data structure
    const data = {
      compliancePeriod: this.state.fields.compliancePeriod.id,
      initiator: DEFAULT_ORGANIZATION.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      type: this.state.fields.transferType
    };

    this.props.addCreditTransfer(data).then((response) => {
      if (comment !== '') {
        this._saveComment(response.data.id, comment);
      }

      this.props.invalidateCreditTransfers();
      history.push(CREDIT_TRANSACTIONS.LIST);
    });

    return false;
  }

  _saveComment (id, comment) {
    // API data structure
    const data = {
      creditTrade: id,
      comment,
      privilegedAccess: true
    };

    return this.props.addCommentToCreditTransfer(data);
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  render () {
    return ([
      <GovernmentTransferForm
        compliancePeriods={this.props.compliancePeriods}
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="creditTransferForm"
        title="New Credit Transaction"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.recommendedForDecision);
        }}
        id="confirmRecommend"
        key="confirmRecommend"
      >
        Are you sure you want to recommend this transaction?
      </Modal>
    ]);
  }
}

GovernmentTransferAddContainer.defaultProps = {
  errors: {}
};

GovernmentTransferAddContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  addCreditTransfer: PropTypes.func.isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers
});

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  addCreditTransfer: bindActionCreators(addCreditTransfer, dispatch),
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GovernmentTransferAddContainer);
