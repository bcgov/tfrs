/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr as reduxToastr} from 'react-redux-toastr';
import PropTypes from 'prop-types';

import {
  addSigningAuthorityConfirmation
} from '../actions/signingAuthorityConfirmationsActions';
import getSigningAuthorityAssertions from '../actions/signingAuthorityAssertionsActions';
import {complianceReporting} from '../actions/complianceReporting';
import CheckBox from '../app/components/CheckBox';
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
    this._addToFields = this._addToFields.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
    this._updateScheduleState = this._updateScheduleState.bind(this);
    this._updateAutosaveState = this._updateAutosaveState.bind(this);
    this.loadData = this.loadData.bind(this);

    this.state = {
      schedules: {},
      terms: [],
      autosaveState: {}
    };
  }

  componentDidMount() {
    this.props.getSigningAuthorityAssertions({
      module: 'compliance_report'
    });

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

    this.setState({
      schedules: {
        ...schedules,
        ...mergedState
      }
    });
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

  _handleSubmit (event, status = 'Draft') {
    if (!this.edit) {
      // creating new
      const payload = {
        status,
        type: 'Compliance Report',
        compliancePeriod: this.props.match.params.period,
        ...this.state.schedules
      };

      this.props.createComplianceReport(payload);
    } else {
      // patch existing
      const payload = {
        status,
        ...this.state.schedules
      };

      this.props.updateComplianceReport({
        id: this.props.match.params.id,
        state: payload,
        patch: true
      });

      const data = [];
      this.state.terms.forEach((term) => {
        if (term.value) {
          data.push({
            complianceReport: this.props.match.params.id,
            hasAccepted: term.value,
            signingAuthorityAssertion: term.id
          });
        }
      });

      if (data.length > 0) {
        this.props.addSigningAuthorityConfirmation(data);
      }
    }
  }

  loadData() {
    this.props.getComplianceReport(this.props.match.params.id);
  }

  _addToFields (value) {
    const { terms } = this.state;
    const found = this.state.terms.find(term => term.id === value.id);

    if (!found) {
      terms.push(value);
    }

    this.setState({
      terms
    });
  }

  _toggleCheck (key) {
    const { terms } = this.state;
    const index = terms.findIndex(term => term.id === key);
    terms[index].value = !terms[index].value;

    this.setState({
      terms
    });
  }

  _updateAutosaveState(tab, state) {
    const autosaveState = {
      ...this.state.autosaveState,
      tab: state
    };
    this.setState({
      autosaveState
    });

    this.props.updateStateToSave(autosaveState);
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
        updateAutosaveState={(state) => {
          this._updateAutosaveState(tab, state);
        }}
      />,
      <ScheduleButtons
        edit={this.edit}
        key="scheduleButtons"
        submit
        delete
        saving={this.props.saving}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSave"
        key="confirmSave"
      >
        Are you sure you want to save this compliance report?
      </Modal>,
      <Modal
        disabled={this.state.terms.findIndex(term => term.value === false) >= 0 ||
          this.state.terms.length === 0}
        handleSubmit={event => this._handleSubmit(event, 'Submitted')}
        id="confirmSubmit"
        key="confirmSubmit"
        title="Signing Authority Declaration"
      >
        <div id="signing-assertions">
          <h2>I, {this.props.loggedInUser.displayName}{this.props.loggedInUser.title ? `, ${this.props.loggedInUser.title}` : ''}:</h2>

          {!this.props.signingAuthorityAssertions.isFetching &&
          this.props.signingAuthorityAssertions.items.map(assertion => (
            <div className="assertion" key={assertion.id}>
              <div className="check">
                <CheckBox
                  addToFields={this._addToFields}
                  fields={this.state.terms}
                  id={assertion.id}
                  toggleCheck={this._toggleCheck}
                />
              </div>
              <div>{assertion.description.substr(1)}</div>
            </div>
          ))}
          Are you sure you want to submit this Compliance Report to the
          Government of British Columbia?
        </div>
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
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
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
    success: PropTypes.bool
  }),
  createComplianceReport: PropTypes.func.isRequired,
  deleteComplianceReport: PropTypes.func.isRequired,
  getComplianceReport: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
  invalidateAutosaved: PropTypes.func.isRequired,
  loadedState: PropTypes.shape(),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string,
      tab: PropTypes.string
    }).isRequired
  }).isRequired,
  saving: PropTypes.bool.isRequired,
  signingAuthorityAssertions: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool
  }).isRequired,
  updateComplianceReport: PropTypes.func.isRequired,
  updateStateToSave: PropTypes.func.isRequired
};

const
  mapDispatchToProps = {
    addSigningAuthorityConfirmation,
    createComplianceReport: complianceReporting.create,
    updateComplianceReport: complianceReporting.update,
    deleteComplianceReport: complianceReporting.remove,
    getComplianceReport: complianceReporting.get,
    getComplianceReports: complianceReporting.find,
    getSigningAuthorityAssertions
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
      errorMessage: state.rootReducer.complianceReporting.errorMessage
    },
    loggedInUser: state.rootReducer.userRequest.loggedInUser,
    referenceData: {
      approvedFuels: state.rootReducer.referenceData.data.approvedFuels,
      isFetching: state.rootReducer.referenceData.isFetching
    },
    signingAuthorityAssertions: {
      items: state.rootReducer.signingAuthorityAssertions.items,
      isFetching: state.rootReducer.signingAuthorityAssertions.isFetching
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
