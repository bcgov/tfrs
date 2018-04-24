/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';
import * as Routes from '../../constants/routes';
import { getFuelSuppliers } from '../../actions/organizationActions';
import {
  getCreditTransfer,
  invalidateCreditTransfers,
  prepareCreditTransfer,
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
        compliancePeriod: { id: 0, description: '' },
        creditsFrom: {},
        creditsTo: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        tradeEffectiveDate: '',
        note: '',
        numberOfCredits: '',
        transferType: '',
        zeroDollarReason: ''
      },
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
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

  _handleSubmit (event, status) {
    event.preventDefault();

    const data = this.props.prepareCreditTransfer(this.state.fields);
    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then((response) => {
      this.props.invalidateCreditTransfers();
      history.push(Routes.HISTORICAL_DATA_ENTRY);
    }, () => {
      // Failed to update
    });

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
        compliancePeriod: (item.compliancePeriod) ? item.compliancePeriod : { id: 0 },
        creditsFrom: item.creditsFrom,
        creditsTo: item.creditsTo,
        fairMarketValuePerCredit: item.fairMarketValuePerCredit,
        note: item.note,
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
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch),
  prepareCreditTransfer: fields => prepareCreditTransfer(fields),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryEditContainer);
