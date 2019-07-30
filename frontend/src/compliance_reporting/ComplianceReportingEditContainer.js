/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr as reduxToastr} from 'react-redux-toastr';
import PropTypes from 'prop-types';

import {complianceReporting} from '../actions/complianceReporting';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import ScheduleAContainer from './ScheduleAContainer';
import ScheduleBContainer from './ScheduleBContainer';
import ScheduleCContainer from './ScheduleCContainer';
import ScheduleDContainer from './ScheduleDContainer';
import ScheduleSummaryContainer from './ScheduleSummaryContainer';
import withReferenceData from '../utils/reference_data_support';
import ComplianceReportIntroContainer from './ComplianceReportIntroContainer';
import Loading from '../app/components/Loading';
import ScheduleButtons from './components/ScheduleButtons';
import ScheduleTabs from './components/ScheduleTabs';
import Modal from '../app/components/Modal';
import history from '../app/History';
import toastr from '../utils/toastr';
import autosaved from '../utils/autosave_support';
import withCreditCalculationService from "./services/credit_calculation_hoc";

class ComplianceReportingEditContainer extends Component {
  static componentForTabName(tab) {
    let TabComponent;

    switch (tab) {
      case 'schedule-a':
        TabComponent = withReferenceData()(ScheduleAContainer);
        break;

      case 'schedule-b':
        TabComponent = withReferenceData({includeCompliancePeriods: true})(withCreditCalculationService()(ScheduleBContainer));
        break;

      case 'schedule-c':
        TabComponent = withReferenceData()(ScheduleCContainer);
        break;

      case 'schedule-d':
        TabComponent = withReferenceData()(ScheduleDContainer);
        break;

      case 'schedule-summary':
        TabComponent = withReferenceData()(ScheduleSummaryContainer);
        break;

      default:
        TabComponent = ComplianceReportIntroContainer;
    }

    return TabComponent;
  }

  constructor(props) {
    super(props);
    this.tabComponent = Loading;
    const {tab} = props.match.params;
    this.tabComponent = ComplianceReportingEditContainer.componentForTabName(tab);

    this.edit = document.location.pathname.indexOf('/edit/') >= 0;
    this._updateScheduleState = this._updateScheduleState.bind(this);
    this.loadData = this.loadData.bind(this);

    let initialState = {
      schedules: {},
    };
    if (props.loadedState) {
      initialState = {
        ...props.loadedState
      }
    }

    this.state = initialState;
  }

  componentDidMount() {
    if (this.edit) {
      this.loadData();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {tab} = nextProps.match.params;

    if (tab !== this.props.match.params.tab) {
      this.tabComponent = ComplianceReportingEditContainer.componentForTabName(tab);
    }

    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error saving');
      } else {
        history.push(COMPLIANCE_REPORTING.LIST);
        toastr.complianceReporting('Draft');
        this.props.invalidateAutosaved();
      }
      return;
    }

    if (this.props.complianceReporting.isUpdating && !nextProps.complianceReporting.isUpdating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error saving');
      } else {
        history.push(COMPLIANCE_REPORTING.LIST);
        toastr.complianceReporting('Draft');
        this.props.invalidateAutosaved();
      }
    }
  }

  _updateScheduleState(mergedState) {
    const {schedules} = this.state;
    const {id} = this.props.match.params;
    const period = this.props.complianceReporting.item.compliancePeriod.description;


    this.setState({
      schedules: {
        ...schedules,
        ...mergedState
      }
    });

    this.props.validateComplianceReport({
      id,
      state: {
        compliancePeriod: period,
        ...schedules,
        ...mergedState
      }
    });

    this.props.updateStateToSave({
        schedules: {
          ...schedules,
          ...mergedState
        }
      }
    );
  }

  _handleDelete() {
    if (this.edit) {
      this.props.deleteComplianceReport({id: this.props.match.params.id});
    }
    this.props.getComplianceReports();
    history.push(COMPLIANCE_REPORTING.LIST);
    toastr.complianceReporting('Cancelled');
    this.props.invalidateAutosaved();
  }

  _handleSubmit() {
    if (!this.edit) {
      // creating new
      const payload = {
        status: 'Draft',
        type: 'Compliance Report',
        compliancePeriod: this.props.match.params.period,
        ...this.state.schedules
      };

      this.props.createComplianceReport(payload);
    } else {
      // patch existing
      const payload = {
        ...this.state.schedules
      };

      this.props.updateComplianceReport({
        id: this.props.match.params.id,
        state: payload,
        patch: true
      });
    }
  }

  loadData() {
    this.props.getComplianceReport(this.props.match.params.id);
  }

  render() {
    const TabComponent = this.tabComponent;

    const {tab, id} = this.props.match.params;
    let {period} = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    if (this.props.complianceReporting.isGetting) {
      return (<Loading/>);
    }

    if (this.edit) {
      if (this.props.complianceReporting.item) {
        period = this.props.complianceReporting.item.compliancePeriod.description;
        if (!period) {
          return (<Loading/>);
        }
      }
    }

    return ([
      <ScheduleTabs
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
        complianceReport={this.props.complianceReporting.item}
        loadedState={this.props.loadedState}
        loggedInUser={this.props.loggedInUser}
        scheduleState={this.state.schedules}
        updateScheduleState={this._updateScheduleState}
      />,
      <ScheduleButtons
        edit={this.edit}
        key="scheduleButtons"
        submit
        delete
        saving={this.props.saving}
        validating={this.props.complianceReporting.validating}
        valid={this.props.complianceReporting.valid}
        validationMessages={this.props.complianceReporting.validationMessages}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to save this compliance report?
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

ComplianceReportingEditContainer.defaultProps = {
  complianceReporting: {
    isCreating: false,
    success: false
  },
  loadedState: null
};

ComplianceReportingEditContainer.propTypes = {
  complianceReporting: PropTypes.shape({
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
    success: PropTypes.bool,
    validating: PropTypes.bool,
    valid: PropTypes.bool,
    validationMessages: PropTypes.object
  }),
  createComplianceReport: PropTypes.func.isRequired,
  deleteComplianceReport: PropTypes.func.isRequired,
  getComplianceReport: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
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
  updateComplianceReport: PropTypes.func.isRequired,
  validateComplianceReport: PropTypes.func.isRequired,
  updateStateToSave: PropTypes.func.isRequired,
};

const
  mapDispatchToProps = {
    createComplianceReport: complianceReporting.create,
    validateComplianceReport: complianceReporting.validate,
    updateComplianceReport: complianceReporting.update,
    deleteComplianceReport: complianceReporting.remove,
    getComplianceReport: complianceReporting.get,
    getComplianceReports: complianceReporting.find
  };

const
  mapStateToProps = state => ({
    complianceReporting: {
      isGetting: state.rootReducer.complianceReporting.isGetting,
      isFinding: state.rootReducer.complianceReporting.isFinding,
      isCreating: state.rootReducer.complianceReporting.isCreating,
      isUpdating: state.rootReducer.complianceReporting.isUpdating,
      success: state.rootReducer.complianceReporting.success,
      item: state.rootReducer.complianceReporting.item,
      errorMessage: state.rootReducer.complianceReporting.errorMessage,
      validating: state.rootReducer.complianceReporting.isValidating,
      valid: state.rootReducer.complianceReporting.validationPassed,
      validationMessages: state.rootReducer.complianceReporting.validationMessages
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
    name: 'compliance-report',
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
)(autosaved(config)(ComplianceReportingEditContainer));
