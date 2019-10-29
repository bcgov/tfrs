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
import AddressBuilder from '../app/components/AddressBuilder';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import ScheduleAContainer from './ScheduleAContainer';
import ScheduleAssessmentContainer from './ScheduleAssessmentContainer';
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
import ChangelogContainer from './ChangelogContainer';

class ComplianceReportingEditContainer extends Component {
  static cleanSummaryValues (summary) {
    return {
      ...summary,
      creditsOffset: Number(summary.creditsOffset),
      dieselClassDeferred: Number(summary.dieselClassDeferred),
      dieselClassObligation: Number(summary.dieselClassObligation),
      dieselClassPreviouslyRetained: Number(summary.dieselClassPreviouslyRetained),
      dieselClassRetained: Number(summary.dieselClassRetained),
      gasolineClassDeferred: Number(summary.gasolineClassDeferred),
      gasolineClassObligation: Number(summary.gasolineClassObligation),
      gasolineClassPreviouslyRetained: Number(summary.gasolineClassPreviouslyRetained),
      gasolineClassRetained: Number(summary.gasolineClassRetained)
    };
  }

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
        TabComponent = withReferenceData({
          includeCompliancePeriods: true
        })(withCreditCalculationService()(ScheduleSummaryContainer));
        break;

      case 'schedule-assessment':
        TabComponent = withReferenceData()(ScheduleAssessmentContainer);
        break;

      case 'changelog':
        TabComponent = withReferenceData()(ChangelogContainer);
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
      fuelSupplierStatus: 'Draft'
    };

    let initialState = {
      schedules: {},
      terms: [],
      getCalled: false,
      createSupplementalCalled: false,
      showPenaltyWarning: false,
      supplementalNoteRequired: (props.complianceReporting.item &&
        props.complianceReporting.item.isSupplemental &&
        props.complianceReporting.item.actions.includes('SUBMIT')),
      supplementalNote: ''
    };
    if (props.loadedState) {
      initialState = {
        ...initialState,
        ...props.loadedState
      };
    }

    this.state = initialState;
    this._addToFields = this._addToFields.bind(this);
    this._handleCreateSupplemental = this._handleCreateSupplemental.bind(this);
    this._handleRecomputeRequest = this._handleRecomputeRequest.bind(this);
    this._handleSupplementalNoteUpdate = this._handleSupplementalNoteUpdate.bind(this);
    this._showPenaltyWarning = this._showPenaltyWarning.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
    this._updateScheduleState = this._updateScheduleState.bind(this);
    this._validate = this._validate.bind(this);
  }

  componentDidMount () {
    this.props.getSigningAuthorityAssertions({
      module: 'compliance_report'
    });

    this.props.getComplianceReports();
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

      if (nextProps.complianceReporting.item &&
        !nextProps.complianceReporting.item.readOnly) {
        const { schedules } = this.state;
        if (schedules.summary && schedules.summary.dieselClassDeferred) {
          schedules.summary.dieselClassDeferred =
            String(schedules.summary.dieselClassDeferred).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.dieselClassObligation) {
          schedules.summary.dieselClassObligation =
            String(schedules.summary.dieselClassObligation).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.dieselClassPreviouslyRetained) {
          schedules.summary.dieselClassPreviouslyRetained =
            String(schedules.summary.dieselClassPreviouslyRetained).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.dieselClassRetained) {
          schedules.summary.dieselClassRetained =
            String(schedules.summary.dieselClassRetained).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.gasolineClassDeferred) {
          schedules.summary.gasolineClassDeferred =
            String(schedules.summary.gasolineClassDeferred).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.gasolineClassObligation) {
          schedules.summary.gasolineClassObligation =
            String(schedules.summary.gasolineClassObligation).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.gasolineClassPreviouslyRetained) {
          schedules.summary.gasolineClassPreviouslyRetained =
            String(schedules.summary.gasolineClassPreviouslyRetained).replace(/,/g, '');
        }
        if (schedules.summary && schedules.summary.gasolineClassRetained) {
          schedules.summary.gasolineClassRetained =
            String(schedules.summary.gasolineClassRetained).replace(/,/g, '');
        }

        this._validate({
          id,
          state: {
            ...schedules
          }
        });
      }

      if (nextProps.complianceReporting.item.hasSnapshot) {
        this.props.getSnapshotRequest(id);
      }

      this.setState({
        supplementalNoteRequired: (nextProps.complianceReporting.item.isSupplemental &&
          nextProps.complianceReporting.item.actions.includes('SUBMIT'))
      });
    }

    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error creating supplemental report');
      } else {
        this.props.invalidateAutosaved();
        toastr.complianceReporting('Supplemental Created');
        history.push(COMPLIANCE_REPORTING.LIST);
      }
    }

    if (this.props.complianceReporting.isUpdating && !nextProps.complianceReporting.isUpdating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error saving');
      } else {
        if (this.status.fuelSupplierStatus) {
          toastr.complianceReporting(this.status.fuelSupplierStatus);
        } else if (this.status.analystStatus && this.status.analystStatus !== 'Unreviewed') {
          toastr.complianceReporting(this.status.analystStatus);
        } else if (this.status.managerStatus && this.status.managerStatus !== 'Unreviewed') {
          toastr.complianceReporting(this.status.managerStatus);
        } else if (this.status.directorStatus && this.status.directorStatus !== 'Unreviewed') {
          toastr.complianceReporting(this.status.directorStatus);
        } else {
          toastr.complianceReporting(this.status);
        }

        this.props.invalidateAutosaved();

        if (this.status.fuelSupplierStatus !== 'Draft') {
          history.push(COMPLIANCE_REPORTING.LIST);
        }
      }
    }

    if (this.props.complianceReporting.isRemoving && !nextProps.complianceReporting.isRemoving) {
      this.props.invalidateAutosaved();
      history.push(COMPLIANCE_REPORTING.LIST);
      toastr.complianceReporting('Cancelled');
    }
  }

  _updateScheduleState (_mergedState) {
    const mergedState = _mergedState;
    const { schedules } = this.state;
    const { id } = this.props.match.params;
    const period = this.props.complianceReporting.item.compliancePeriod.description;

    if (schedules.summary && schedules.summary.dieselClassDeferred) {
      schedules.summary.dieselClassDeferred =
        String(schedules.summary.dieselClassDeferred).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.dieselClassObligation) {
      schedules.summary.dieselClassObligation =
        String(schedules.summary.dieselClassObligation).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.dieselClassPreviouslyRetained) {
      schedules.summary.dieselClassPreviouslyRetained =
        String(schedules.summary.dieselClassPreviouslyRetained).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.dieselClassRetained) {
      schedules.summary.dieselClassRetained =
        String(schedules.summary.dieselClassRetained).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.gasolineClassDeferred) {
      schedules.summary.gasolineClassDeferred =
        String(schedules.summary.gasolineClassDeferred).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.gasolineClassObligation) {
      schedules.summary.gasolineClassObligation =
        String(schedules.summary.gasolineClassObligation).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.gasolineClassPreviouslyRetained) {
      schedules.summary.gasolineClassPreviouslyRetained =
        String(schedules.summary.gasolineClassPreviouslyRetained).replace(/,/g, '');
    }
    if (schedules.summary && schedules.summary.gasolineClassRetained) {
      schedules.summary.gasolineClassRetained =
        String(schedules.summary.gasolineClassRetained).replace(/,/g, '');
    }

    if (mergedState.summary && mergedState.summary.dieselClassDeferred) {
      mergedState.summary.dieselClassDeferred =
        String(mergedState.summary.dieselClassDeferred).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.dieselClassObligation) {
      mergedState.summary.dieselClassObligation =
        String(mergedState.summary.dieselClassObligation).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.dieselClassPreviouslyRetained) {
      mergedState.summary.dieselClassPreviouslyRetained =
        String(mergedState.summary.dieselClassPreviouslyRetained).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.dieselClassRetained) {
      mergedState.summary.dieselClassRetained =
        String(mergedState.summary.dieselClassRetained).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.gasolineClassDeferred) {
      mergedState.summary.gasolineClassDeferred =
        String(mergedState.summary.gasolineClassDeferred).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.gasolineClassObligation) {
      mergedState.summary.gasolineClassObligation =
        String(mergedState.summary.gasolineClassObligation).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.gasolineClassPreviouslyRetained) {
      mergedState.summary.gasolineClassPreviouslyRetained =
        String(mergedState.summary.gasolineClassPreviouslyRetained).replace(/,/g, '');
    }
    if (mergedState.summary && mergedState.summary.gasolineClassRetained) {
      mergedState.summary.gasolineClassRetained =
        String(mergedState.summary.gasolineClassRetained).replace(/,/g, '');
    }

    this.setState({
      schedules: {
        ...schedules,
        ...mergedState
      }
    });

    this._validate({
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
  }

  _handleCreateSupplemental (event, compliancePeriodDescription) {
    this.setState({
      createSupplementalCalled: true
    });

    this.props.createComplianceReport({
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Compliance Report',
      compliancePeriod: compliancePeriodDescription,
      supplements: Number(this.props.match.params.id)
    });
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

  _handleSupplementalNoteUpdate (event) {
    this.setState({
      supplementalNote: event.target.value
    });
  }

  _handleSubmit (event, status = { fuelSupplierStatus: 'Draft' }) {
    // patch existing
    const payload = {
      status,
      ...this.state.schedules
    };

    if (this.state.supplementalNoteRequired &&
      status.fuelSupplierStatus &&
      status.fuelSupplierStatus === 'Submitted') {
      payload.supplementalNote = this.state.supplementalNote;
    }

    if (payload.summary) {
      const { summary } = payload;

      payload.summary = ComplianceReportingEditContainer.cleanSummaryValues(summary);
    }

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

    if (!this.props.complianceReporting.validationMessages ||
      Object.keys(this.props.complianceReporting.validationMessages).length === 0) {
      this.props.recomputeTotals({
        id,
        state: {
          ...schedules
        }
      });
    }
  }

  _showPenaltyWarning (bool) {
    this.setState({
      ...this.state,
      showPenaltyWarning: bool
    });
  }

  _validate (_payload) {
    const payload = _payload;
    if (payload.state && payload.state.summary) {
      const { summary } = payload.state;

      payload.state.summary = ComplianceReportingEditContainer.cleanSummaryValues(summary);
    }

    return this.props.validateComplianceReport(payload);
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

    if (this.props.complianceReporting.snapshotIsLoading) {
      return (<Loading />);
    }

    let period = null;
    if (typeof (this.props.complianceReporting.item.compliancePeriod) === 'string') {
      period = this.props.complianceReporting.item.compliancePeriod;
    } else {
      period = this.props.complianceReporting.item.compliancePeriod.description;
    }

    let organizationAddress = null;

    if (this.props.complianceReporting.item.hasSnapshot &&
      this.props.complianceReporting.snapshot &&
      this.props.complianceReporting.snapshot.organization.organizationAddress) {
      ({ organizationAddress } = this.props.complianceReporting.snapshot.organization);
    } else if (this.props.loggedInUser.organization.organizationAddress &&
      !this.props.loggedInUser.isGovernmentUser) {
      ({ organizationAddress } = this.props.loggedInUser.organization);
    }

    return ([
      <h2 key="main-header">
        {this.props.complianceReporting.item.organization.name}
        {` -- `}
        {typeof this.props.complianceReporting.item.type === 'string' && this.props.complianceReporting.item.type}
        {this.props.complianceReporting.item.type.theType}
        {` for `}
        {typeof this.props.complianceReporting.item.compliancePeriod === 'string' && this.props.complianceReporting.item.compliancePeriod}
        {this.props.complianceReporting.item.compliancePeriod.description}
      </h2>,
      <p key="organization-address">
        {organizationAddress &&
          AddressBuilder({
            address_line_1: organizationAddress.addressLine_1,
            address_line_2: organizationAddress.addressLine_2,
            address_line_3: organizationAddress.addressLine_3,
            city: organizationAddress.city,
            state: organizationAddress.state,
            postal_code: organizationAddress.postalCode
          })
        }
      </p>,
      <ScheduleTabs
        active={tab}
        compliancePeriod={period}
        complianceReport={this.props.complianceReporting.item}
        edit={this.edit}
        hasSnapshot={this.props.complianceReporting.item.hasSnapshot}
        id={id}
        key="nav"
        loggedInUser={this.props.loggedInUser}
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
        showPenaltyWarning={this._showPenaltyWarning}
        snapshot={this.props.complianceReporting.snapshot}
        snapshotIsLoading={this.props.complianceReporting.snapshotIsLoading}
        updateScheduleState={this._updateScheduleState}
        valid={this.props.complianceReporting.valid !== false}
        validating={this.props.complianceReporting.validating}
        validationMessages={this.props.complianceReporting.validationMessages}
      />,
      <ScheduleButtons
        actions={this.props.complianceReporting.item.actions}
        actor={this.props.complianceReporting.item.actor}
        compliancePeriod={period}
        complianceReport={this.props.complianceReporting.item}
        complianceReports={{
          isFetching: this.props.complianceReports.isFinding,
          items: this.props.complianceReports.items
        }}
        edit={this.edit}
        key="scheduleButtons"
        loggedInUser={this.props.loggedInUser}
        saving={this.props.saving}
        tab={tab}
        valid={this.props.complianceReporting.valid !== false}
        validating={this.props.complianceReporting.validating}
        validationMessages={this.props.complianceReporting.validationMessages}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { analystStatus: 'Requested Supplemental' })}
        id="confirmAnalystRequestSupplemental"
        key="confirmAnalystRequestSupplemental"
      >
        Are you sure you want to request a supplemental compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { analystStatus: 'Recommended' })}
        id="confirmAnalystRecommendAcceptance"
        key="confirmAnalystRecommendAcceptance"
      >
        Are you sure you want to recommend acceptance of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { analystStatus: 'Not Recommended' })}
        id="confirmAnalystRecommendRejection"
        key="confirmAnalystRecommendRejection"
      >
        Are you sure you want to recommend rejection of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { managerStatus: 'Requested Supplemental' })}
        id="confirmManagerRequestSupplemental"
        key="confirmManagerRequestSupplemental"
      >
        Are you sure you want to request a supplemental compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { managerStatus: 'Recommended' })}
        id="confirmManagerRecommendAcceptance"
        key="confirmManagerRecommendAcceptance"
      >
        Are you sure you want to recommend acceptance of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { managerStatus: 'Not Recommended' })}
        id="confirmManagerRecommendRejection"
        key="confirmManagerRecommendRejection"
      >
        Are you sure you want to recommend rejection of the compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { directorStatus: 'Rejected' })}
        id="confirmDirectorReject"
        key="confirmDirectorReject"
      >
        Are you sure you want to reject this compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, { directorStatus: 'Accepted' })}
        id="confirmDirectorAccept"
        key="confirmDirectorAccept"
      >
        Are you sure you want to accept this compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSave"
        key="confirmSave"
      >
        Are you sure you want to save this compliance report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleCreateSupplemental(event, period)}
        id="confirmCreateSupplemental"
        key="confirmCreateSupplemental"
      >
        Are you sure you want to create a supplemental compliance report?
      </Modal>,
      <Modal
        disabled={(this.state.supplementalNoteRequired &&
          (this.state.supplementalNote.trim().length === 0)) ||
        (this.state.terms.filter(term => term.value === true).length <
          this.props.signingAuthorityAssertions.items.length)}
        handleSubmit={event => this._handleSubmit(event, { fuelSupplierStatus: 'Submitted' })}
        id="confirmSubmit"
        key="confirmSubmit"
        title="Signing Authority Declaration"
        tooltipMessage="Please complete the Signing Authority declaration."
      >
        {this.state.showPenaltyWarning &&
          <div className="alert alert-warning">
            <p>
              Based on the information contained within this report, your organization is not
              compliant with the Part 2 and/or the Part 3 requirements.
            </p>
            <p>
              Please be advised that payment of penalties must be submitted to the
              Ministry of Energy, Mines and Petroleum Resources; cheques or money orders
              are to be made payable to the Minister of Finance.
            </p>
          </div>
        }
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
          {this.state.supplementalNoteRequired &&
          <div>
            <hr />
            <label htmlFor="supplementalReasonInput">
              Supplemental Report Reason
            </label>
            <textarea
              id="supplementalReasonInput"
              name="supplementalReasonInput"
              rows={4}
              maxLength={500}
              minLength={1}
              value={this.state.supplementalNote}
              onChange={e => this._handleSupplementalNoteUpdate(e)}
              placeholder="Use this field to provide a brief explanation for the supplemental report."
              required
            />
            <hr />
          </div>
          }
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
    isRemoving: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape({
      actions: PropTypes.arrayOf(PropTypes.string),
      actor: PropTypes.string,
      compliancePeriod: PropTypes.oneOfType([
        PropTypes.shape({
          description: PropTypes.string
        }),
        PropTypes.string
      ]),
      hasSnapshot: PropTypes.bool,
      isSupplemental: PropTypes.bool,
      organization: PropTypes.shape(),
      readOnly: PropTypes.bool,
      status: PropTypes.shape(),
      type: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.string
      ])
    }),
    isRecomputing: PropTypes.bool,
    recomputeResult: PropTypes.object,
    success: PropTypes.bool,
    valid: PropTypes.bool,
    validating: PropTypes.bool,
    validationMessages: PropTypes.object,
    snapshot: PropTypes.shape(),
    snapshotIsLoading: PropTypes.bool.isRequired
  }),
  complianceReports: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()),
    isFinding: PropTypes.bool
  }).isRequired,
  createComplianceReport: PropTypes.func.isRequired,
  deleteComplianceReport: PropTypes.func.isRequired,
  getComplianceReport: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  getSnapshotRequest: PropTypes.func.isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
  invalidateAutosaved: PropTypes.func.isRequired,
  loadedState: PropTypes.shape(),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      organizationAddress: PropTypes.shape()
    }),
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
    getSnapshotRequest: complianceReporting.getSnapshot,
    recomputeTotals: complianceReporting.recompute,
    updateComplianceReport: complianceReporting.update,
    validateComplianceReport: complianceReporting.validate
  };

const
  mapStateToProps = state => ({
    complianceReporting: {
      errorMessage: state.rootReducer.complianceReporting.errorMessage,
      isRemoving: state.rootReducer.complianceReporting.isRemoving,
      isFinding: state.rootReducer.complianceReporting.isFinding,
      isGetting: state.rootReducer.complianceReporting.isGetting,
      isRecomputing: state.rootReducer.complianceReporting.isRecomputing,
      isUpdating: state.rootReducer.complianceReporting.isUpdating,
      isCreating: state.rootReducer.complianceReporting.isCreating,
      item: state.rootReducer.complianceReporting.item,
      recomputeResult: state.rootReducer.complianceReporting.recomputeResult,
      success: state.rootReducer.complianceReporting.success,
      valid: state.rootReducer.complianceReporting.validationPassed,
      validating: state.rootReducer.complianceReporting.isValidating,
      validationMessages: state.rootReducer.complianceReporting.validationMessages,
      snapshot: state.rootReducer.complianceReporting.snapshotItem,
      snapshotIsLoading: state.rootReducer.complianceReporting.isGettingSnapshot
    },
    complianceReports: state.rootReducer.complianceReporting,
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
    customPathGenerator: props => (props.location.pathname)
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(autosaved(config)(ComplianceReportingEditContainer));
