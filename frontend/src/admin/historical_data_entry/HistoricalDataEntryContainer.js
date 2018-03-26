/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { getFuelSuppliers } from '../../actions/organizationActions';
import HistoricalDataEntryPage from './components/HistoricalDataEntryPage';

class HistoricalDataEntryContainer extends Component {
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
      selectedId: 0,
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._selectIdForModal = this._selectIdForModal.bind(this);
  }

  componentDidMount () {
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
      note: this.state.fields.note,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      transferType: this.state.fields.transferType,
      zeroDollarReason: this.state.fields.zeroDollarReason
    };

    console.log(data);

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
    if (['numberOfCredits', 'dollarPerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.dollarPerCredit
      });
    }
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
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
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
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryContainer);
