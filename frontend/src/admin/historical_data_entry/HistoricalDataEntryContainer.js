/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  addCommentToCreditTransfer,
  addCreditTransfer,
  deleteCreditTransfer,
  getApprovedCreditTransfersIfNeeded,
  invalidateCreditTransfer,
  invalidateCreditTransfers,
  prepareCreditTransfer,
  processApprovedCreditTransfers
} from '../../actions/creditTransfersActions';
import getCompliancePeriods from '../../actions/compliancePeriodsActions';
import { getFuelSuppliers } from '../../actions/organizationActions';
import HistoricalDataEntryPage from './components/HistoricalDataEntryPage';
import AdminTabs from '../components/AdminTabs';

class HistoricalDataEntryContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fields: {
        comment: '',
        compliancePeriod: { id: 0, description: '' },
        creditsFrom: { id: 0, name: '' },
        creditsTo: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        numberOfCredits: '',
        tradeEffectiveDate: '',
        transferType: ''
      },
      selectedId: 0,
      totalValue: 0
    };

    this.oldState = Object.assign({}, this.state);

    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._processApprovedCreditTransfers = this._processApprovedCreditTransfers.bind(this);
    this._selectIdForModal = this._selectIdForModal.bind(this);
  }

  componentDidMount () {
    this.props.invalidateCreditTransfers();
    this.loadData();
    this.props.getCompliancePeriods();
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    const fieldState = { ...this.state.fields };

    this.setState({
      fields: fieldState
    });
  }

  loadData () {
    this.props.invalidateCreditTransfer(); // reset the errors in the form
    this.props.getApprovedCreditTransfersIfNeeded();
  }

  _deleteCreditTransfer () {
    const id = this.state.selectedId;

    this.props.deleteCreditTransfer(id).then(() => {
      this.props.invalidateCreditTransfers();
      this.loadData();
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

  _handleSubmit (event) {
    event.preventDefault();

    const data = this.props.prepareCreditTransfer(this.state.fields);
    const { comment } = this.state.fields;

    if (comment.length > 0) {
      data.comment = comment;
    }

    this.props.addCreditTransfer(data).then((response) => {
      this.props.invalidateCreditTransfers();
      this.loadData();
      this.resetState();
    });

    return false;
  }

  _processApprovedCreditTransfers () {
    this.props.processApprovedCreditTransfers().then(() => {
      this.loadData();
    });
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
    return ([
      <AdminTabs
        active="historical-data"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <HistoricalDataEntryPage
        addErrors={this.props.addErrors}
        commitErrors={this.props.commitErrors}
        commitMessage={this.props.commitMessage}
        compliancePeriods={this.props.compliancePeriods}
        deleteCreditTransfer={this._deleteCreditTransfer}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleDelete={this._handleDelete}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        historicalData={this.props.historicalData}
        key="page"
        processApprovedCreditTransfers={this._processApprovedCreditTransfers}
        selectedId={this.state.selectedId}
        selectIdForModal={this._selectIdForModal}
        title="Historical Data Entry"
        totalValue={this.state.totalValue}
        validationErrors={this.state.validationErrors}
      />
    ]);
  }
}

HistoricalDataEntryContainer.defaultProps = {
  addErrors: {},
  commitErrors: {},
  commitMessage: ''
};

HistoricalDataEntryContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  addCreditTransfer: PropTypes.func.isRequired,
  addErrors: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string
  ]),
  commitErrors: PropTypes.shape({}),
  commitMessage: PropTypes.string,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getApprovedCreditTransfersIfNeeded: PropTypes.func.isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
  prepareCreditTransfer: PropTypes.func.isRequired,
  processApprovedCreditTransfers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  addErrors: state.rootReducer.creditTransfer.errors,
  commitErrors: state.rootReducer.approvedCreditTransfers.errors,
  commitMessage: state.rootReducer.approvedCreditTransfers.message,
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  historicalData: {
    items: state.rootReducer.approvedCreditTransfers.items,
    isFetching: state.rootReducer.approvedCreditTransfers.isFetching
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  addCreditTransfer: bindActionCreators(addCreditTransfer, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  getApprovedCreditTransfersIfNeeded: () => {
    dispatch(getApprovedCreditTransfersIfNeeded());
  },
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch),
  prepareCreditTransfer: fields => prepareCreditTransfer(fields),
  processApprovedCreditTransfers: bindActionCreators(processApprovedCreditTransfers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataEntryContainer);
