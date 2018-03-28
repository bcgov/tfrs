/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';
import { addCreditTransfer, getApprovedCreditTransfersIfNeeded, invalidateCreditTransfers } from '../../actions/creditTransfersActions';
import { getFuelSuppliers } from '../../actions/organizationActions';
import HistoricalDataEntryPage from './components/HistoricalDataEntryPage';

class HistoricalDataEntryContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fields: {
        creditsFrom: { id: 0, name: '' },
        creditsTo: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        note: '',
        numberOfCredits: '',
        tradeEffectiveDate: '',
        transferType: ''
      },
      selectedId: 0,
      totalValue: 0
    };

    this.oldState = Object.assign({}, this.state);

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._selectIdForModal = this._selectIdForModal.bind(this);
  }

  componentDidMount () {
    this.props.getFuelSuppliers();
    this.loadData();
  }

  componentWillReceiveProps (props) {
    const fieldState = { ...this.state.fields };

    this.setState({
      fields: fieldState
    });
  }

  loadData () {
    this.props.getApprovedCreditTransfersIfNeeded();
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

  _handleSubmit (event, status) {
    event.preventDefault();

    // API data structure
    const data = {
      fairMarketValuePerCredit: this.state.fields.fairMarketValuePerCredit,
      initiator: this.state.fields.creditsFrom.id,
      note: this.state.fields.note,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.creditsTo.id,
      status: CREDIT_TRANSFER_STATUS.approved.id,
      tradeEffectiveDate: this.state.fields.tradeEffectiveDate,
      type: this.state.fields.transferType,
      zeroDollarReason: this.state.fields.zeroDollarReason
    };

    this.props.addCreditTransfer(data).then(() => {
      this.props.invalidateCreditTransfers();
      this.loadData();
      this.resetState();
    });

    return false;
  }

  _selectIdForModal (id) {
    this.setState({
      selectedId: id
    });
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

  resetState () {
    this.setState(this.oldState);
  }

  render () {
    return (
      <HistoricalDataEntryPage
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        historicalData={this.props.historicalData}
        selectedId={this.state.selectedId}
        selectIdForModal={this._selectIdForModal}
        title="Historical Data Entry"
        totalValue={this.state.totalValue}
      />
    );
  }
}

HistoricalDataEntryContainer.defaultProps = {
  errors: {}
};

HistoricalDataEntryContainer.propTypes = {
  addCreditTransfer: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getApprovedCreditTransfersIfNeeded: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfers.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  historicalData: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  addCreditTransfer: bindActionCreators(addCreditTransfer, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getApprovedCreditTransfersIfNeeded: () => {
    dispatch(getApprovedCreditTransfersIfNeeded());
  },
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryContainer);
