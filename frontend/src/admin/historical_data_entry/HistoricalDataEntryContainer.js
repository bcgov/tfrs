/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as Routes from '../../constants/routes';
import { getFuelSuppliers } from '../../actions/organizationActions';
import { getLoggedInUser } from '../../actions/userActions';
import HistoricalDataEntryPage from './components/HistoricalDataEntryPage';

class HistoricalDataEntryContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fields: {
        creditsFrom: {},
        creditsTo: { id: 0, name: '' },
        dollarPerCredit: '',
        note: '',
        numberOfCredits: ''
      },
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
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
      effectiveDate: null,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      note: this.state.fields.note,
    };

    this.props.addCreditTransfer(data).then(() => {
      this.props.invalidateCreditTransfers();
      history.push(Routes.CREDIT_TRANSACTIONS);
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

  componentDidMount () {
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    const fieldState = { ...this.state.fields };
    fieldState.creditsFrom = this.props.loggedInUser.organization;
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
        title="Historical Data Entry"
        totalValue={this.state.totalValue}
      />
    );
  }
}

HistoricalDataEntryContainer.defaultProps = {
  errors: {}
}

HistoricalDataEntryContainer.propTypes = {
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfers.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  historicalData: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryContainer);
