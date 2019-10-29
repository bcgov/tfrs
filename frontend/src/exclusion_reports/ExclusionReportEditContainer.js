/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import {addSigningAuthorityConfirmation} from '../actions/signingAuthorityConfirmationsActions';
import {complianceReporting} from '../actions/complianceReporting';
import {exclusionReports} from '../actions/exclusionReports';
import getSigningAuthorityAssertions from '../actions/signingAuthorityAssertionsActions';
import AddressBuilder from '../app/components/AddressBuilder';
import CheckBox from '../app/components/CheckBox';
import history from '../app/History';
import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import ExclusionReportButtons from './components/ExclusionReportButtons';
import ExclusionReportTabs from './components/ExclusionReportTabs';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import ExclusionAgreementContainer from './ExclusionAgreementContainer';
import ExclusionAssessmentContainer from './ExclusionAssessmentContainer';
import ExclusionReportIntroContainer from './ExclusionReportIntroContainer';
import ExclusionReportChangelogContainer from './ExclusionReportChangelogContainer';
import withReferenceData from '../utils/reference_data_support';
import autosaved from '../utils/autosave_support';
import toastr from '../utils/toastr';

class ExclusionReportEditContainer extends Component {
  static componentForTabName(tab) {
    let TabComponent;

    switch (tab) {
      case 'exclusion-agreement':
        TabComponent = withReferenceData()(ExclusionAgreementContainer);
        break;

      case 'schedule-assessment':
        TabComponent = withReferenceData()(ExclusionAssessmentContainer);
        break;

      case 'changelog':
        TabComponent = withReferenceData()(ExclusionReportChangelogContainer);
        break;

      default:
        TabComponent = ExclusionReportIntroContainer;
    }

    return TabComponent;
  }

  constructor(props) {
    super(props);
    this.tabComponent = Loading;
    const {tab} = props.match.params;
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
      exclusionAgreement: {},
      terms: [],
      createSupplementalCalled: false,
      supplementalNoteRequired: (props.exclusionReports.item &&
        props.exclusionReports.item.isSupplemental &&
        props.exclusionReports.item.actions.includes('SUBMIT')),
      supplementalNote: ''
    };

    this._addToFields = this._addToFields.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
    this._handleCreateSupplemental = this._handleCreateSupplemental.bind(this);
    this._handleSupplementalNoteUpdate = this._handleSupplementalNoteUpdate.bind(this);
  }

  componentDidMount() {
    this.props.getSigningAuthorityAssertions({
      module: 'exclusion_report'
    });

    this.loadData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {tab} = nextProps.match.params;

    if (tab !== this.props.match.params.tab) {
      this.tabComponent = ExclusionReportEditContainer.componentForTabName(tab);
    }

    if (this.props.exclusionReports.isUpdating && !nextProps.exclusionReports.isUpdating) {
      if (nextProps.exclusionReports.success) {
        if (this.status.fuelSupplierStatus) {
          toastr.exclusionReports(this.status.fuelSupplierStatus);
        } else if (this.status.analystStatus && this.status.analystStatus !== 'Unreviewed') {
          toastr.exclusionReports(this.status.analystStatus);
        } else if (this.status.managerStatus && this.status.managerStatus !== 'Unreviewed') {
          toastr.exclusionReports(this.status.managerStatus);
        } else if (this.status.directorStatus && this.status.directorStatus !== 'Unreviewed') {
          toastr.exclusionReports(this.status.directorStatus);
        } else {
          toastr.exclusionReports(this.status);
        }

        this.props.invalidateAutosaved();

        if (this.status.fuelSupplierStatus !== 'Draft') {
          history.push(COMPLIANCE_REPORTING.LIST);
        }
      }
    }

    if (this.props.exclusionReports.isRemoving && !nextProps.exclusionReports.isRemoving) {
      history.push(COMPLIANCE_REPORTING.LIST);
      toastr.exclusionReports('Cancelled');
      this.props.invalidateAutosaved();
    }

    if (this.props.exclusionReports.isGetting && !nextProps.exclusionReports.isGetting) {
      const { id } = this.props.match.params;

      this.setState({
        supplementalNoteRequired: (nextProps.exclusionReports.item.isSupplemental &&
          nextProps.exclusionReports.item.actions.includes('SUBMIT'))
      });

      if (nextProps.exclusionReports.item.hasSnapshot) {
        this.props.getSnapshotRequest(id);
      }
    }

    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (!nextProps.complianceReporting.success) {
        toastr.error('Error creating supplemental report');
      } else {
        this.props.invalidateAutosaved();
        toastr.exclusionReports('Supplemental Created');
        history.push(COMPLIANCE_REPORTING.LIST);
      }
    }
  }

  loadData() {
    this.props.getExclusionReport(this.props.match.params.id);
  }

  _addToFields(value) {
    const {terms} = this.state;

    const found = terms.find(term => term.id === value.id);

    if (!found) {
      terms.push(value);
    }

    this.setState({
      terms
    });
  }

  _handleDelete() {
    this.props.deleteComplianceReport({id: this.props.match.params.id});
  }

  _handleCreateSupplemental(event, compliancePeriodDescription) {
    this.setState({
      createSupplementalCalled: true
    });

    this.props.createComplianceReport({
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Exclusion Report',
      compliancePeriod: compliancePeriodDescription,
      supplements: Number(this.props.match.params.id)
    });
  }


  _handleSupplementalNoteUpdate(event) {
    this.setState({
      supplementalNote: event.target.value
    });
  }


  _handleSubmit(event, status = {fuelSupplierStatus: 'Draft'}) {
    // patch existing
    const payload = {
      status,
      ...this.state.exclusionAgreement
    };


    if (this.state.supplementalNoteRequired &&
      status.fuelSupplierStatus &&
      status.fuelSupplierStatus === 'Submitted') {
      payload.supplementalNote = this.state.supplementalNote;
    }

    this.status = status;

    this.props.updateExclusionReport({
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

  _toggleCheck(key) {
    const {terms} = this.state;
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

  _updateScheduleState(mergedState) {
    const {exclusionAgreement} = this.state;

    this.setState({
      exclusionAgreement: {
        ...exclusionAgreement,
        ...mergedState
      }
    });
  }

  render() {
    const TabComponent = this.tabComponent;

    const {tab, id} = this.props.match.params;
    let {period} = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    if (this.props.exclusionReports.isGetting || !this.props.exclusionReports.item) {
      return (<Loading/>);
    }

    if (this.props.complianceReporting.snapshotIsLoading) {
      return (<Loading/>);
    }

    if (typeof (this.props.exclusionReports.item.compliancePeriod) === 'string') {
      period = this.props.exclusionReports.item.compliancePeriod;
    } else {
      period = this.props.exclusionReports.item.compliancePeriod.description;
    }

    let organizationAddress = null;

    if (this.props.exclusionReports.item.hasSnapshot &&
      this.props.complianceReporting.snapshot &&
      this.props.complianceReporting.snapshot.organization.organizationAddress) {
      ({ organizationAddress } = this.props.complianceReporting.snapshot.organization);
    } else if (this.props.loggedInUser.organization.organizationAddress &&
      !this.props.loggedInUser.isGovernmentUser) {
      ({ organizationAddress } = this.props.loggedInUser.organization);
    }

    return ([
      <h2 key="main-header">
        {this.props.exclusionReports.item.organization.name}
        &nbsp;--&nbsp;
        {this.props.exclusionReports.item.type.theType}
        &nbsp;for&nbsp;
        {this.props.exclusionReports.item.compliancePeriod.description}
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
      <ExclusionReportTabs
        active={tab}
        compliancePeriod={period}
        edit={this.edit}
        exclusionReport={this.props.exclusionReports.item}
        id={id}
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <TabComponent
        key="tab-component"
        period={period}
        id={id}
        create={!this.edit}
        exclusionReport={this.props.exclusionReports.item}
        loadedState={this.props.loadedState}
        loggedInUser={this.props.loggedInUser}
        match={this.props.match}
        snapshot={this.props.complianceReporting.snapshot}
        updateScheduleState={this._updateScheduleState}
        updateAutosaveState={(state) => {
          this._updateAutosaveState(tab, state);
        }}
      />,
      <ExclusionReportButtons
        actions={this.props.exclusionReports.item.actions}
        actor={this.props.exclusionReports.item.actor}
        edit={this.edit}
        key="exclusionReportButtons"
        loggedInUser={this.props.loggedInUser}
        saving={this.props.saving}
      />,
      <Modal
        disabled={(this.state.supplementalNoteRequired &&
          (this.state.supplementalNote.trim().length === 0)) || (this.state.terms.filter(term => term.value === true).length <
          this.props.signingAuthorityAssertions.items.length)}
        handleSubmit={event => this._handleSubmit(event, {fuelSupplierStatus: 'Submitted'})}
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
          {this.state.supplementalNoteRequired &&
          <div>
            <hr/>
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
            <hr/>
          </div>
          }
          Are you sure you want to submit this Exclusion Report to the
          Government of British Columbia?
        </div>
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSave"
        key="confirmSave"
      >
        Are you sure you want to save this exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleDelete(event)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleCreateSupplemental(event, period)}
        id="confirmCreateSupplemental"
        key="confirmCreateSupplemental"
      >
        Are you sure you want to create a supplemental exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {analystStatus: 'Requested Supplemental'})}
        id="confirmAnalystRequestSupplemental"
        key="confirmAnalystRequestSupplemental"
      >
        Are you sure you want to request a supplemental exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {analystStatus: 'Recommended'})}
        id="confirmAnalystRecommendAcceptance"
        key="confirmAnalystRecommendAcceptance"
      >
        Are you sure you want to recommend acceptance of the exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {analystStatus: 'Not Recommended'})}
        id="confirmAnalystRecommendRejection"
        key="confirmAnalystRecommendRejection"
      >
        Are you sure you want to recommend rejection of the exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {managerStatus: 'Requested Supplemental'})}
        id="confirmManagerRequestSupplemental"
        key="confirmManagerRequestSupplemental"
      >
        Are you sure you want to request a supplemental exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {managerStatus: 'Recommended'})}
        id="confirmManagerRecommendAcceptance"
        key="confirmManagerRecommendAcceptance"
      >
        Are you sure you want to recommend acceptance of the exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {managerStatus: 'Not Recommended'})}
        id="confirmManagerRecommendRejection"
        key="confirmManagerRecommendRejection"
      >
        Are you sure you want to recommend rejection of the exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {directorStatus: 'Rejected'})}
        id="confirmDirectorReject"
        key="confirmDirectorReject"
      >
        Are you sure you want to reject this exclusion report?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleSubmit(event, {directorStatus: 'Accepted'})}
        id="confirmDirectorAccept"
        key="confirmDirectorAccept"
      >
        Are you sure you want to accept this exclusion report?
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
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  deleteComplianceReport: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  createComplianceReport: PropTypes.func.isRequired,
  complianceReporting: PropTypes.shape({
    isCreating: PropTypes.bool,
    snapshot: PropTypes.shape(),
    success: PropTypes.bool
  }),
  exclusionReports: PropTypes.shape({
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
      organization: PropTypes.shape,
      type: PropTypes.shape()
    }),
    success: PropTypes.bool
  }),
  getExclusionReport: PropTypes.func.isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
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
  signingAuthorityAssertions: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool
  }).isRequired,
  updateExclusionReport: PropTypes.func.isRequired,
  updateStateToSave: PropTypes.func.isRequired
};

const
  mapDispatchToProps = {
    addSigningAuthorityConfirmation,
    deleteComplianceReport: exclusionReports.remove,
    getComplianceReports: complianceReporting.find,
    createComplianceReport: complianceReporting.create,
    getExclusionReport: exclusionReports.get,
    getSnapshotRequest: complianceReporting.getSnapshot,
    getSigningAuthorityAssertions,
    updateExclusionReport: exclusionReports.update
  };

const
  mapStateToProps = state => ({
    exclusionReports: {
      errorMessage: state.rootReducer.exclusionReports.errorMessage,
      isFinding: state.rootReducer.exclusionReports.isFinding,
      isGetting: state.rootReducer.exclusionReports.isGetting,
      isRemoving: state.rootReducer.exclusionReports.isRemoving,
      isUpdating: state.rootReducer.exclusionReports.isUpdating,
      item: state.rootReducer.exclusionReports.item,
      success: state.rootReducer.exclusionReports.success,
      valid: state.rootReducer.exclusionReports.validationPassed,
      validating: state.rootReducer.exclusionReports.isValidating,
      validationMessages: state.rootReducer.exclusionReports.validationMessages
    },
    complianceReporting: {
      isCreating: state.rootReducer.complianceReporting.isCreating,
      success: state.rootReducer.complianceReporting.success,
      errorMessage: state.rootReducer.complianceReporting.errorMessage,
      snapshot: state.rootReducer.complianceReporting.snapshotItem,
      snapshotIsLoading: state.rootReducer.complianceReporting.isGettingSnapshot
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
    name: 'exclusion-report',
    customPathGenerator: props => (props.location.pathname)
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(autosaved(config)(ExclusionReportEditContainer));
