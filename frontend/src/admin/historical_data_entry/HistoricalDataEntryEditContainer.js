/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';
import HISTORICAL_DATA_ENTRY from '../../constants/routes/HistoricalDataEntry';
import { getFuelSuppliers } from '../../actions/organizationActions';
import {
  addCommentToCreditTransfer,
  getCreditTransfer,
  invalidateCreditTransfers,
  prepareCreditTransfer,
  updateCommentOnCreditTransfer,
  updateCreditTransfer
} from '../../actions/creditTransfersActions';
import getCompliancePeriods from '../../actions/compliancePeriodsActions';
import history from '../../app/History';
import HistoricalDataEntryForm from './components/HistoricalDataEntryForm';

const buttonActions = [Lang.BTN_CANCEL, Lang.BTN_SAVE];

class HistoricalDataEntryEditContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fields: {
        comment: '',
        compliancePeriod: { id: 0, description: '' },
        creditsFrom: {},
        creditsTo: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        numberOfCredits: '',
        tradeEffectiveDate: '',
        transferType: '',
        zeroDollarReason: ''
      },
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillMount () {
    this.loadData(this.props.match.params.id);
    this.props.getCompliancePeriods();
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
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
      }, () => this.computeTotalValue(name));
    }
  }

  _handleSubmit (event) {
    event.preventDefault();

    const data = this.props.prepareCreditTransfer(this.state.fields);
    const { id } = this.props.item;
    const { comment } = this.state.fields;

    this.props.updateCreditTransfer(id, data).then(() => {
      if (comment !== '') {
        this._saveComment(comment);
      }

      this.props.invalidateCreditTransfers();
      history.push(HISTORICAL_DATA_ENTRY.LIST);
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

  computeTotalValue (name) {
    if (['numberOfCredits', 'fairMarketValuePerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.fairMarketValuePerCredit
      });
    }
  }

  loadData (id) {
    this.props.getCreditTransfer(id);
  }

  loadPropsToFieldState (props) {
    if (Object.keys(props.item).length !== 0) {
      const { item } = props;

      const fieldState = {
        // we only allow one comment per entry in the Historical Data Entry
        comment: (item.comments.length > 0) ? item.comments[0].comment : '',
        compliancePeriod: (item.compliancePeriod) ? item.compliancePeriod : { id: 0 },
        creditsFrom: item.creditsFrom,
        creditsTo: item.creditsTo,
        fairMarketValuePerCredit: item.fairMarketValuePerCredit,
        numberOfCredits: item.numberOfCredits.toString(),
        tradeEffectiveDate: (item.tradeEffectiveDate) ? item.tradeEffectiveDate.toString() : '',
        transferType: item.type.id.toString(),
        zeroDollarReason: (item.zeroReason) ? item.zeroReason.id.toString() : ''
      };

      this.setState({
        fields: fieldState,
        totalValue: item.totalValue
      });
    }
  }

  render () {
    return (
      <HistoricalDataEntryForm
        actions={buttonActions}
        compliancePeriods={this.props.compliancePeriods}
        editMode
        errors={this.props.errors}
        fuelSuppliers={this.props.fuelSuppliers}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        totalValue={this.state.totalValue}
      />
    );
  }
}

HistoricalDataEntryEditContainer.defaultProps = {
  errors: {}
};

HistoricalDataEntryEditContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  getCreditTransfer: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  prepareCreditTransfer: PropTypes.func.isRequired,
  updateCommentOnCreditTransfer: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item
});

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch),
  prepareCreditTransfer: fields => prepareCreditTransfer(fields),
  updateCommentOnCreditTransfer: bindActionCreators(updateCommentOnCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryEditContainer);
