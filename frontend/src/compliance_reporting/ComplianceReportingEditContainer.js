/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr as reduxToastr } from 'react-redux-toastr';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import { addSigningAuthorityConfirmation } from '../actions/signingAuthorityConfirmationsActions';
import getSigningAuthorityAssertions from '../actions/signingAuthorityAssertionsActions';
import { complianceReporting } from '../actions/complianceReporting';
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
import withCreditCalculationService from './services/credit_calculation_hoc';
import toastr from '../utils/toastr';
import autosaved from '../utils/autosave_support';

class ComplianceReportingEditContainer extends Component {
  static componentForTabName (tab) {
    let TabComponent;

    switch (tab) {
      case 'schedule-a':
        TabComponent = withReferenceData()(ScheduleAContainer);
        break;

      case 'schedule-b':
        TabComponent = withReferenceData({
          includeCompliancePeriods: true
        })(withCreditCalculationService()(ScheduleBContainer));
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

  constructor (props) {
    super(props);
    this.tabComponent = Loading;
    const { tab } = props.match.params;
    this.tabComponent = ComplianceReportingEditContainer.componentForTabName(tab);
    this.status = {
      'fuelSupplierStatus': 'Draft'
    };

    this._updateScheduleState = this._updateScheduleState.bind(this);
    this._handleRecomputeRequest = this._handleRecomputeRequest.bind(this);

    let initialState = {
      schedules: {},
      terms: [],
      getCalled: false
    };
    if (props.loadedState) {
      initialState = {
        ...initialState,
        ...props.loadedState
      };
    }

    this.state = initialState;
    this._addToFields = this._addToFields.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.props.getSigningAuthorityAssertions({
      module: 'compliance_report'
    });

    this.props.getComplianceReport(this.props.match.params.id);
    this.setState({
      getCalled: true
    });
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { tab } = nextProps.match.params;

    if (tab !== this.props.match.params.tab) {
      this.tabComponent = ComplianceReportingEditContainer.componentForTabName(tab);
    }

    if (this.props.complianceReporting.isGetting && !nextProps.complianceReporting.isGetting) {
      const { id } = this.props.match.params;
      // const period = nextProps.complianceReporting.item.compliancePeriod.description;

      this.props.validateComplianceReport({
        id,
        state: {
          // compliancePeriod: period,
          ...this.state.schedules
        }
      });
    }

    if (this.props.complianceReporting.isUpdating && !nextProps.complianceReporting.isUpdating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error saving');
      } else {
        toastr.complianceReporting(this.status.fuelSupplierStatus);
        this.props.invalidateAutosaved();

        if (this.status.fuelSupplierStatus === 'Submitted') {
          history.push(COMPLIANCE_REPORTING.LIST);
        }
      }
    }
  }

  _updateScheduleState (mergedState) {
    const { schedules } = this.state;
    const { id } = this.props.match.params;
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
    });
  }

  _handleDelete () {
    this.props.deleteComplianceReport({ id: this.props.match.params.id });

    this.props.getComplianceReports();
    history.push(COMPLIANCE_REPORTING.LIST);
    toastr.complianceReporting('Cancelled');
    this.props.invalidateAutosaved();
  }

  _addToFields (value) {
    const { terms } = this.state;

    const found = terms.find(term => term.id === value.id);

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

  _handleSubmit (event, status = {'fuelSupplierStatus': 'Draft'}) {
    // patch existing
    const payload = {
      status,
      ...this.state.schedules
    };

    this.status = status;

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

  _handleRecomputeRequest () {
    const { schedules } = this.state;
    const { id } = this.props.match.params;

    this.props.recomputeTotals({
      id,
      state: {
        ...schedules
      }
    });
  }

  render () {
    const TabComponent = this.tabComponent;

    const { tab, id } = this.props.match.params;

    if (!this.state.getCalled) {
      return (<Loading />);
    }

    if (this.props.complianceReporting.isGetting) {
      return (<Loading />);
    }

    let period = null;
    if (typeof (this.props.complianceReporting.item.compliancePeriod) === 'string') {
      period = this.props.complianceReporting.item.compliancePeriod;
    } else {
      period = this.props.complianceReporting.item.compliancePeriod.description;
    }

    return ([
      <ScheduleTabs
        active={tab}
        compliancePeriod={period}
        edit={this.edit}
        hasSnapshot={this.props.complianceReporting.item.hasSnapshot}
        id={id}
        key="nav"
      />,
      <TabComponent
        complianceReport={this.props.complianceReporting.item}
        id={id}
        key="tab-component"
        loggedInUser={this.props.loggedInUser}
        period={period}
        readOnly={this.props.complianceReporting.item.readOnly}
        recomputedTotals={this.props.complianceReporting.recomputeResult}
        recomputeRequest={this._handleRecomputeRequest}
        recomputing={this.props.complianceReporting.isRecomputing}
        scheduleState={this.state.schedules}
        updateScheduleState={this._updateScheduleState}
        valid={this.props.complianceReporting.valid !== false}
        validating={this.props.complianceReporting.validating}
        validationMessages={this.props.complianceReporting.validationMessages}
      />,
      <ScheduleButtons
        delete={!this.props.complianceReporting.item.readOnly}
        edit={this.edit}
        key="scheduleButtons"
        loggedInUser={this.props.loggedInUser}
        managerRecommend={this.props.complianceReporting.item.status && ['Analyst Accepted', 'Analyst Rejected'].indexOf(this.props.complianceReporting.item.status.status) >= 0}
        recommend={this.props.complianceReporting.item.status && this.props.complianceReporting.item.status.status === 'Submitted'}
        saving={this.props.saving}
        submit={!this.props.complianceReporting.item.readOnly}
        valid={this.props.complianceReporting.valid !== false}
        validating={this.props.complianceReporting.validating}
        validationMessages={this.props.complianceReporting.validationMessages}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event, 'Analyst Accepted')}
        id="confirmAnalystRecommendAcceptance"
        key="confirmAnalystRecommendAcceptance"
      >
        Are you sure you want to recommend acceptance of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, 'Analyst Rejected')}
        id="confirmAnalystRecommendRejection"
        key="confirmAnalystRecommendRejection"
      >
        Are you sure you want to recommend rejection of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, 'Manager Accepted')}
        id="confirmManagerRecommendAcceptance"
        key="confirmManagerRecommendAcceptance"
      >
        Are you sure you want to recommend acceptance of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, 'Manager Rejected')}
        id="confirmManagerRecommendRejection"
        key="confirmManagerRecommendRejection"
      >
        Are you sure you want to recommend rejection of the compliance report?
      </Modal>,
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
        handleSubmit={event => this._handleSubmit(event, {'fuelSupplierStatus': 'Submitted'})}
        id="confirmSubmit"
        key="confirmSubmit"
        title="Signing Authority Declaration"
        tooltipMessage="Please complete the Signing Authority declaration."
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
              <div>
                <ReactMarkdown
                  source={assertion.description.substr(1)}
                />
              </div>
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
      ]),
      readOnly: PropTypes.bool,
      status: PropTypes.shape()
    }),
    isRecomputing: PropTypes.bool,
    recomputeResult: PropTypes.object,
    success: PropTypes.bool,
    valid: PropTypes.bool,
    validating: PropTypes.bool,
    validationMessages: PropTypes.object
  }),
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
  recomputeTotals: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  signingAuthorityAssertions: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool
  }).isRequired,
  updateComplianceReport: PropTypes.func.isRequired,
  updateStateToSave: PropTypes.func.isRequired,
  validateComplianceReport: PropTypes.func.isRequired
};

const
  mapDispatchToProps = {
    addSigningAuthorityConfirmation,
    createComplianceReport: complianceReporting.create,
    deleteComplianceReport: complianceReporting.remove,
    getComplianceReport: complianceReporting.get,
    getComplianceReports: complianceReporting.find,
    getSigningAuthorityAssertions,
    recomputeTotals: complianceReporting.recompute,
    updateComplianceReport: complianceReporting.update,
    validateComplianceReport: complianceReporting.validate
  };

const
  mapStateToProps = state => ({
    complianceReporting: {
      errorMessage: state.rootReducer.complianceReporting.errorMessage,
      isFinding: state.rootReducer.complianceReporting.isFinding,
      isGetting: state.rootReducer.complianceReporting.isGetting,
      isRecomputing: state.rootReducer.complianceReporting.isRecomputing,
      isUpdating: state.rootReducer.complianceReporting.isUpdating,
      item: state.rootReducer.complianceReporting.item,
      recomputeResult: state.rootReducer.complianceReporting.recomputeResult,
      success: state.rootReducer.complianceReporting.success,
      valid: state.rootReducer.complianceReporting.validationPassed,
      validating: state.rootReducer.complianceReporting.isValidating,
      validationMessages: state.rootReducer.complianceReporting.validationMessages
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
    version: 4,
    name: 'compliance-report',
    customPathGenerator: props => (`edit:${props.match.params.id}`)
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(autosaved(config)(ComplianceReportingEditContainer));
