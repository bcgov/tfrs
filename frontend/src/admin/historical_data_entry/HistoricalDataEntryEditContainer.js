/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';
import { getFuelSuppliers } from '../../actions/organizationActions';
import { getCreditTransfer } from '../../actions/creditTransfersActions';
import HistoricalDataEntryForm from './components/HistoricalDataEntryForm';

const buttonActions = [Lang.BTN_CANCEL, Lang.BTN_SAVE_DRAFT];

class HistoricalDataEntryEditContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fields: {
        creditsFrom: {},
        creditsTo: { id: 0, name: '' },
        dollarPerCredit: '',
        effectiveDate: '',
        note: '',
        numberOfCredits: '',
        transferType: ''
      },
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
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

  _handleSubmit (event, status) {
    event.preventDefault();

    // API data structure
    const data = {
      creditsFrom: this.state.fields.creditsFrom.id,
      creditsTo: this.state.fields.creditsTo.id,
      dollarPerCredit: this.state.fields.dollarPerCredit,
      effectiveDate: this.state.fields.effectiveDate,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      note: this.state.fields.note,
      transferType: this.state.fields.transferType,
      zeroDollarReason: this.state.fields.zeroDollarReason
    };

    const { id } = this.props.item;

    console.log(id);
    console.log(data);

    return false;
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  computeTotalValue (name) {
    if (['numberOfCredits', 'dollarPerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.dollarPerCredit
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
        creditsFrom: item.creditsFrom,
        creditsTo: item.creditsTo,
        dollarPerCredit: item.fairMarketValuePerCredit,
        effectiveDate: (item.tradeEffectiveDate) ? item.tradeEffectiveDate.toString() : '',
        note: '',
        numberOfCredits: item.numberOfCredits.toString(),
        transferType: item.type.id.toString(),
        zeroDollarReason: item.zeroReason
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
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCreditTransfer: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfers.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryEditContainer);
