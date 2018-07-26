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
  getCreditTransfer,
  invalidateCreditTransfer,
  invalidateCreditTransfers,
  updateCommentOnCreditTransfer,
  updateCreditTransfer
} from '../actions/creditTransfersActions';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';

class GovernmentTransferEditContainer extends Component {
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
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  loadData (id) {
    this.props.getCreditTransfer(id);
  }

  loadPropsToFieldState (props) {
    if (Object.keys(props.item).length !== 0) {
      const { item } = props;
      const fieldState = {
        comment: (item.comments.length > 0) ? item.comments[0].comment : '',
        compliancePeriod: (item.compliancePeriod) ? item.compliancePeriod : { id: 0 },
        numberOfCredits: item.numberOfCredits.toString(),
        respondent: item.respondent,
        transferType: item.type.id.toString()
      };

      this.setState({
        fields: fieldState
      });
    }
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

    const { id } = this.props.item;
    const { comment } = this.state.fields;

    // API data structure
    const data = {
      compliancePeriod: this.state.fields.compliancePeriod.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      type: this.state.fields.transferType
    };

    this.props.updateCreditTransfer(id, data).then((response) => {
      if (comment !== '') {
        this._saveComment(comment);
      }

      this.props.invalidateCreditTransfers();
      history.push(CREDIT_TRANSACTIONS.LIST);
    });

    return false;
  }

  _saveComment (comment) {
    const { item } = this.props;
    // API data structure
    const data = {
      creditTrade: this.props.item.id,
      comment,
      privilegedAccess: true
    };

    if (item.comments.length > 0) {
      // we only allow one comment per entry in the Historical Data Entry
      return this.props.updateCommentOnCreditTransfer(item.comments[0].id, data);
    }

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
        title="Edit Credit Transaction"
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

GovernmentTransferEditContainer.defaultProps = {
  errors: {}
};

GovernmentTransferEditContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  getCreditTransfer: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateCommentOnCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  item: state.rootReducer.creditTransfer.item
});

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch),
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch),
  updateCommentOnCreditTransfer: bindActionCreators(updateCommentOnCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GovernmentTransferEditContainer);
