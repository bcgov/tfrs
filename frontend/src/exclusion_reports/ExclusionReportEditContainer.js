/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { complianceReporting } from '../actions/complianceReporting';
import { exclusionReports } from '../actions/exclusionReports';
import history from '../app/History';
import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import ExclusionReportButtons from './components/ExclusionReportButtons';
import ExclusionReportTabs from './components/ExclusionReportTabs';
import ExclusionAgreementContainer from './ExclusionAgreementContainer';
import ExclusionReportIntroContainer from './ExclusionReportIntroContainer';
import withReferenceData from '../utils/reference_data_support';
import autosaved from '../utils/autosave_support';
import toastr from '../utils/toastr';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';

class ExclusionReportEditContainer extends Component {
  static componentForTabName (tab) {
    let TabComponent;

    switch (tab) {
      case 'exclusion-agreement':
        TabComponent = withReferenceData()(ExclusionAgreementContainer);
        break;

      default:
        TabComponent = ExclusionReportIntroContainer;
    }

    return TabComponent;
  }

  constructor (props) {
    super(props);
    this.tabComponent = Loading;
    const { tab } = props.match.params;
    this.tabComponent = ExclusionReportEditContainer.componentForTabName(tab);
    this.status = {
      fuelSupplierStatus: 'Draft'
    };

    this.edit = document.location.pathname.indexOf('/edit/') >= 0;
    this._updateScheduleState = this._updateScheduleState.bind(this);
    this._updateAutosaveState = this._updateAutosaveState.bind(this);
    this.loadData = this.loadData.bind(this);

    this.state = {
      autosaveState: {},
      exclusionAgreement: {}
    };
  }

  componentDidMount () {
    this.loadData();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { tab } = nextProps.match.params;

    if (tab !== this.props.match.params.tab) {
      this.tabComponent = ExclusionReportEditContainer.componentForTabName(tab);
    }

    if (this.props.exclusionReports.isUpdating && !nextProps.exclusionReports.isUpdating) {
      if (nextProps.exclusionReports.success) {
        toastr.exclusionReports(this.status.fuelSupplierStatus);
        this.props.invalidateAutosaved();
      }
    }
  }

  _updateScheduleState (mergedState) {
    const { exclusionAgreement } = this.state;

    this.setState({
      exclusionAgreement: {
        ...exclusionAgreement,
        ...mergedState
      }
    });
  }

  _handleDelete () {
    this.props.deleteComplianceReport({ id: this.props.match.params.id });

    this.props.getComplianceReports();
    history.push(COMPLIANCE_REPORTING.LIST);
    toastr.complianceReporting('Cancelled');
    this.props.invalidateAutosaved();
  }

  _handleSubmit (event, status = { fuelSupplierStatus: 'Draft' }) {
    // patch existing
    const payload = {
      status,
      ...this.state.exclusionAgreement
    };

    this.status = status;

    this.props.updateExclusionReport({
      id: this.props.match.params.id,
      state: payload,
      patch: true
    });
  }

  loadData () {
    this.props.getExclusionReport(this.props.match.params.id);
  }

  _updateAutosaveState (tab, state) {
    const autosaveState = {
      ...this.state.autosaveState,
      tab: state
    };
    this.setState({
      autosaveState
    });

    this.props.updateStateToSave(autosaveState);
  }

  render () {
    const TabComponent = this.tabComponent;

    const { tab, id } = this.props.match.params;
    let { period } = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    if (this.props.exclusionReports.isGetting) {
      return (<Loading />);
    }

    return ([
      <ExclusionReportTabs
        active={tab}
        compliancePeriod={period}
        edit={this.edit}
        id={id}
        key="nav"
      />,
      <TabComponent
        key="tab-component"
        period={period}
        id={id}
        create={!this.edit}
        exclusionReport={this.props.exclusionReports.item}
        loadedState={this.props.loadedState}
        loggedInUser={this.props.loggedInUser}
        updateScheduleState={this._updateScheduleState}
        updateAutosaveState={(state) => {
          this._updateAutosaveState(tab, state);
        }}
      />,
      <ExclusionReportButtons
        edit={this.edit}
        key="exclusionReportButtons"
        submit
        delete
        saving={this.props.saving}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to save this exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleDelete(event)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    ]);
  }
}

ExclusionReportEditContainer.defaultProps = {
  exclusionReports: {
    isCreating: false,
    success: false
  },
  loadedState: null
};

ExclusionReportEditContainer.propTypes = {
  deleteComplianceReport: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  exclusionReports: PropTypes.shape({
    isCreating: PropTypes.bool,
    isGetting: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape({
      compliancePeriod: PropTypes.oneOfType([
        PropTypes.shape({
          description: PropTypes.string
        }),
        PropTypes.string
      ])
    }),
    success: PropTypes.bool
  }),
  getExclusionReport: PropTypes.func.isRequired,
  invalidateAutosaved: PropTypes.func.isRequired,
  loadedState: PropTypes.shape(),
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string,
      tab: PropTypes.string
    }).isRequired
  }).isRequired,
  saving: PropTypes.bool.isRequired,
  updateExclusionReport: PropTypes.func.isRequired,
  updateStateToSave: PropTypes.func.isRequired
};

const
  mapDispatchToProps = {
    deleteComplianceReport: complianceReporting.remove,
    getComplianceReports: complianceReporting.find,
    getExclusionReport: exclusionReports.get,
    updateExclusionReport: exclusionReports.update
  };

const
  mapStateToProps = state => ({
    exclusionReports: {
      errorMessage: state.rootReducer.exclusionReports.errorMessage,
      isFinding: state.rootReducer.exclusionReports.isFinding,
      isGetting: state.rootReducer.exclusionReports.isGetting,
      isUpdating: state.rootReducer.exclusionReports.isUpdating,
      item: state.rootReducer.exclusionReports.item,
      success: state.rootReducer.exclusionReports.success,
      valid: state.rootReducer.exclusionReports.validationPassed,
      validating: state.rootReducer.exclusionReports.isValidating,
      validationMessages: state.rootReducer.exclusionReports.validationMessages
    },
    loggedInUser: state.rootReducer.userRequest.loggedInUser,
    referenceData: {
      approvedFuels: state.rootReducer.referenceData.data.approvedFuels,
      isFetching: state.rootReducer.referenceData.isFetching
    }
  });

const
  config = {
    key: '-',
    version: 3,
    name: 'exclusion-report',
    customPathGenerator: (props) => {
      if (props.match.path.indexOf('/edit/') >= 0) {
        return `edit:${props.match.params.id}`;
      } else if (props.match.path.indexOf('/add/') >= 0) {
        return `add:${props.match.params.period}`;
      }
      return props.location.pathname;
    }
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(autosaved(config)(ExclusionReportEditContainer));
