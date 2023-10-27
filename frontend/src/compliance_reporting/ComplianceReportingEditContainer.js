/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toastr as reduxToastr } from 'react-redux-toastr'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { getUpdatedLoggedInUser } from '../actions/userActions'
import * as NumberFormat from '../constants/numeralFormats'
import { addSigningAuthorityConfirmation } from '../actions/signingAuthorityConfirmationsActions'
import getSigningAuthorityAssertions from '../actions/signingAuthorityAssertionsActions'
import { complianceReporting } from '../actions/complianceReporting'
import CheckBox from '../app/components/CheckBox'
import AddressBuilder from '../app/components/AddressBuilder'
import PERMISSIONS_COMPLIANCE_REPORT from '../constants/permissions/ComplianceReport'
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting'
import ScheduleAContainer from './ScheduleAContainer'
import ScheduleAssessmentContainer from './ScheduleAssessmentContainer'
import ScheduleBContainer from './ScheduleBContainer'
import ScheduleCContainer from './ScheduleCContainer'
import ScheduleDContainer from './ScheduleDContainer'
import ScheduleSummaryContainer from './ScheduleSummaryContainer'
import withReferenceData from '../utils/reference_data_support'
import ComplianceReportIntroContainer from './ComplianceReportIntroContainer'
import Loading from '../app/components/Loading'
import ScheduleButtons from './components/ScheduleButtons'
import ScheduleTabs from './components/ScheduleTabs'
import Modal from '../app/components/Modal'
import withCreditCalculationService from './services/credit_calculation_hoc'
import toastr from '../utils/toastr'
import autosaved from '../utils/autosave_support'
import ChangelogContainer from './ChangelogContainer'
import Tooltip from '../app/components/Tooltip'
import { withRouter } from '../utils/withRouter'
import { atLeastOneAttorneyAddressFieldExists } from '../utils/functions'

class ComplianceReportingEditContainer extends Component {
  static cleanSummaryValues (summary) {
    return {
      ...summary,
      creditsOffset: Number(summary.creditsOffset),
      creditsOffsetA: Number(summary.creditsOffsetA),
      creditsOffsetB: Number(summary.creditsOffsetB),
      creditsOffsetC: Number(summary.creditsOffsetC),
      dieselClassDeferred: Number(summary.dieselClassDeferred),
      dieselClassObligation: Number(summary.dieselClassObligation),
      dieselClassPreviouslyRetained: Number(summary.dieselClassPreviouslyRetained),
      dieselClassRetained: Number(summary.dieselClassRetained),
      gasolineClassDeferred: Number(summary.gasolineClassDeferred),
      gasolineClassObligation: Number(summary.gasolineClassObligation),
      gasolineClassPreviouslyRetained: Number(summary.gasolineClassPreviouslyRetained),
      gasolineClassRetained: Number(summary.gasolineClassRetained)
    }
  }

  static componentForTabName (tab) {
    let TabComponent

    switch (tab) {
      case 'schedule-a':
        TabComponent = withReferenceData()(ScheduleAContainer)
        break

      case 'schedule-b':
        TabComponent = withReferenceData({
          includeCompliancePeriods: true
        })(withCreditCalculationService()(ScheduleBContainer))
        break

      case 'schedule-c':
        TabComponent = withReferenceData()(ScheduleCContainer)
        break

      case 'schedule-d':
        TabComponent = withReferenceData()(ScheduleDContainer)
        break

      case 'schedule-summary':
        TabComponent = withReferenceData({
          includeCompliancePeriods: true
        })(withCreditCalculationService()(ScheduleSummaryContainer))
        break

      case 'schedule-assessment':
        TabComponent = withReferenceData()(ScheduleAssessmentContainer)
        break

      case 'changelog':
        TabComponent = withReferenceData()(ChangelogContainer)
        break

      default:
        TabComponent = ComplianceReportIntroContainer
    }

    return TabComponent
  }

  constructor (props) {
    super(props)
    this.tabComponent = Loading
    const { tab } = props.params
    this.tabComponent = ComplianceReportingEditContainer.componentForTabName(tab)
    this.status = {
      fuelSupplierStatus: 'Draft'
    }

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
    }
    if (props.loadedState) {
      initialState = {
        ...initialState,
        ...props.loadedState
      }
    }

    this.state = initialState
    this._addToFields = this._addToFields.bind(this)
    this._handleCreateSupplemental = this._handleCreateSupplemental.bind(this)
    this._handleRecomputeRequest = this._handleRecomputeRequest.bind(this)
    this._handleSupplementalNoteUpdate = this._handleSupplementalNoteUpdate.bind(this)
    this._showPenaltyWarning = this._showPenaltyWarning.bind(this)
    this._toggleCheck = this._toggleCheck.bind(this)
    this._updateScheduleState = this._updateScheduleState.bind(this)
    this._validate = this._validate.bind(this)
  }

  componentDidMount () {
    this.props.getSigningAuthorityAssertions({
      module: 'compliance_report'
    })

    this.props.getComplianceReports()
    this.props.getComplianceReport(this.props.params.id)

    this.setState({
      getCalled: true
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    const { tab } = nextProps.params

    if (tab !== this.props.params.tab) {
      this.tabComponent = ComplianceReportingEditContainer.componentForTabName(tab)
    }

    if (this.props.complianceReporting.isGetting && !nextProps.complianceReporting.isGetting) {
      const { id } = this.props.params

      if (nextProps.complianceReporting.item &&
        !nextProps.complianceReporting.item?.readOnly) {
        const { schedules } = this.state

        if (schedules.summary && schedules.summary.dieselClassDeferred) {
          schedules.summary.dieselClassDeferred =
            String(schedules.summary.dieselClassDeferred).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.dieselClassObligation) {
          schedules.summary.dieselClassObligation =
            String(schedules.summary.dieselClassObligation).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.dieselClassPreviouslyRetained) {
          schedules.summary.dieselClassPreviouslyRetained =
            String(schedules.summary.dieselClassPreviouslyRetained).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.dieselClassRetained) {
          schedules.summary.dieselClassRetained =
            String(schedules.summary.dieselClassRetained).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.gasolineClassDeferred) {
          schedules.summary.gasolineClassDeferred =
            String(schedules.summary.gasolineClassDeferred).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.gasolineClassObligation) {
          schedules.summary.gasolineClassObligation =
            String(schedules.summary.gasolineClassObligation).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.gasolineClassPreviouslyRetained) {
          schedules.summary.gasolineClassPreviouslyRetained =
            String(schedules.summary.gasolineClassPreviouslyRetained).replace(/,/g, '')
        }
        if (schedules.summary && schedules.summary.gasolineClassRetained) {
          schedules.summary.gasolineClassRetained =
            String(schedules.summary.gasolineClassRetained).replace(/,/g, '')
        }

        this._validate({
          id,
          state: {
            ...schedules
          }
        })
      }

      if (nextProps.complianceReporting.item?.hasSnapshot) {
        this.props.getSnapshotRequest(id)
      }

      this.setState({
        supplementalNoteRequired: (nextProps.complianceReporting.item?.isSupplemental &&
          nextProps.complianceReporting.item?.actions.includes('SUBMIT'))
      })
    }

    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error creating supplemental report')
      } else {
        this.props.invalidateAutosaved()
        toastr.complianceReporting('Supplemental Created')
        this.props.navigate(COMPLIANCE_REPORTING.EDIT_REDIRECT.replace(':id', nextProps.complianceReporting.item?.id))
      }
    }

    if (this.props.complianceReporting.isUpdating && !nextProps.complianceReporting.isUpdating) {
      if (!nextProps.complianceReporting.success) {
        const errorMessage = nextProps.complianceReporting.errorMessage?.length > 0 ? nextProps.complianceReporting.errorMessage.join('\r\n') : 'Error saving'
       reduxToastr.error(errorMessage)
      } else {
        if (this.status.fuelSupplierStatus) {
          toastr.complianceReporting(this.status.fuelSupplierStatus)
        } else if (this.status.analystStatus && this.status.analystStatus !== 'Unreviewed') {
          toastr.complianceReporting(this.status.analystStatus)
        } else if (this.status.managerStatus && this.status.managerStatus !== 'Unreviewed') {
          toastr.complianceReporting(this.status.managerStatus)
        } else if (this.status.directorStatus && this.status.directorStatus !== 'Unreviewed') {
          toastr.complianceReporting(this.status.directorStatus)
        } else {
          toastr.complianceReporting(this.status)
        }

        this.props.invalidateAutosaved()

        if (this.status.fuelSupplierStatus !== 'Draft') {
          this.props.getUpdatedLoggedInUser()
          this.props.navigate(COMPLIANCE_REPORTING.LIST)
        }
      }
    }

    if (this.props.complianceReporting.isRemoving && !nextProps.complianceReporting.isRemoving) {
      this.props.invalidateAutosaved()
      this.props.navigate(COMPLIANCE_REPORTING.LIST)
      toastr.complianceReporting('Cancelled')
    }
  }

  _updateScheduleState (_mergedState) {
    const mergedState = _mergedState
    const { schedules } = this.state
    const { id } = this.props.params
    const period = this.props.complianceReporting.item.compliancePeriod.description

    if (schedules.summary && schedules.summary.dieselClassDeferred) {
      schedules.summary.dieselClassDeferred =
        String(schedules.summary.dieselClassDeferred).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.dieselClassObligation) {
      schedules.summary.dieselClassObligation =
        String(schedules.summary.dieselClassObligation).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.dieselClassPreviouslyRetained) {
      schedules.summary.dieselClassPreviouslyRetained =
        String(schedules.summary.dieselClassPreviouslyRetained).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.dieselClassRetained) {
      schedules.summary.dieselClassRetained =
        String(schedules.summary.dieselClassRetained).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.gasolineClassDeferred) {
      schedules.summary.gasolineClassDeferred =
        String(schedules.summary.gasolineClassDeferred).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.gasolineClassObligation) {
      schedules.summary.gasolineClassObligation =
        String(schedules.summary.gasolineClassObligation).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.gasolineClassPreviouslyRetained) {
      schedules.summary.gasolineClassPreviouslyRetained =
        String(schedules.summary.gasolineClassPreviouslyRetained).replace(/,/g, '')
    }
    if (schedules.summary && schedules.summary.gasolineClassRetained) {
      schedules.summary.gasolineClassRetained =
        String(schedules.summary.gasolineClassRetained).replace(/,/g, '')
    }

    if (mergedState.summary && mergedState.summary.dieselClassDeferred) {
      mergedState.summary.dieselClassDeferred =
        String(mergedState.summary.dieselClassDeferred).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.dieselClassObligation) {
      mergedState.summary.dieselClassObligation =
        String(mergedState.summary.dieselClassObligation).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.dieselClassPreviouslyRetained) {
      mergedState.summary.dieselClassPreviouslyRetained =
        String(mergedState.summary.dieselClassPreviouslyRetained).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.dieselClassRetained) {
      mergedState.summary.dieselClassRetained =
        String(mergedState.summary.dieselClassRetained).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.gasolineClassDeferred) {
      mergedState.summary.gasolineClassDeferred =
        String(mergedState.summary.gasolineClassDeferred).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.gasolineClassObligation) {
      mergedState.summary.gasolineClassObligation =
        String(mergedState.summary.gasolineClassObligation).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.gasolineClassPreviouslyRetained) {
      mergedState.summary.gasolineClassPreviouslyRetained =
        String(mergedState.summary.gasolineClassPreviouslyRetained).replace(/,/g, '')
    }
    if (mergedState.summary && mergedState.summary.gasolineClassRetained) {
      mergedState.summary.gasolineClassRetained =
        String(mergedState.summary.gasolineClassRetained).replace(/,/g, '')
    }

    this.setState({
      schedules: {
        ...schedules,
        ...mergedState
      }
    })

    this._validate({
      id,
      state: {
        compliancePeriod: period,
        ...schedules,
        ...mergedState
      }
    })

    this.props.updateStateToSave({
      schedules: {
        ...schedules,
        ...mergedState
      }
    })
  }

  _handleDelete () {
    this.props.deleteComplianceReport({ id: this.props.params.id })

    setTimeout(() => {
      this.props.getUpdatedLoggedInUser()
    }, 2000)
  }

  _handleCreateSupplemental (event, compliancePeriodDescription) {
    this.setState({
      createSupplementalCalled: true
    })

    this.props.createComplianceReport({
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Compliance Report',
      compliancePeriod: compliancePeriodDescription,
      supplements: Number(this.props.params.id)
    })

    setTimeout(() => {
      this.props.getUpdatedLoggedInUser()
    }, 2000)
  }

  _addToFields (value) {
    const { terms } = this.state

    const found = terms.find(term => term.id === value.id)

    if (!found) {
      terms.push(value)
    }

    this.setState({
      terms
    })
  }

  _toggleCheck (key) {
    const { terms } = this.state
    const index = terms.findIndex(term => term.id === key)
    terms[index].value = !terms[index].value

    this.setState({
      terms
    })
  }

  _handleSupplementalNoteUpdate (event) {
    this.setState({
      supplementalNote: event.target.value
    })
  }

  _handleSubmit (event, status = { fuelSupplierStatus: 'Draft' }) {
    // patch existing
    const payload = {
      status,
      ...this.state.schedules
    }

    if (this.state.supplementalNoteRequired &&
      status.fuelSupplierStatus &&
      status.fuelSupplierStatus === 'Submitted') {
      payload.supplementalNote = this.state.supplementalNote
    }

    if (payload.summary) {
      const { summary } = payload
      payload.summary = ComplianceReportingEditContainer.cleanSummaryValues(summary)
    }

    this.status = status

    this.props.updateComplianceReport({
      id: this.props.params.id,
      state: payload,
      patch: true
    })

    const data = []
    this.state.terms.forEach((term) => {
      if (term.value) {
        data.push({
          complianceReport: this.props.params.id,
          hasAccepted: term.value,
          signingAuthorityAssertion: term.id
        })
      }
    })

    if (data.length > 0) {
      this.props.addSigningAuthorityConfirmation(data)
    }
  }

  _handleRecomputeRequest () {
    const { schedules } = this.state

    const { id } = this.props.params
    const { complianceReporting: report } = this.props

    if (!complianceReporting.validationMessages ||
      Object.keys(complianceReporting.validationMessages).length === 0) {
      const { summary } = schedules

      if (summary && !summary.dieselClassDeferred) {
        summary.dieselClassDeferred = 0
      }

      if (summary && !summary.dieselClassRetained) {
        summary.dieselClassRetained = 0
      }

      if (summary && !summary.dieselClassPreviouslyRetained) {
        summary.dieselClassPreviouslyRetained = 0
      }

      if (summary && !summary.dieselClassObligation) {
        summary.dieselClassObligation = 0
      }

      if (summary && !summary.gasolineClassDeferred) {
        summary.gasolineClassDeferred = 0
      }

      if (summary && !summary.gasolineClassRetained) {
        summary.gasolineClassRetained = 0
      }

      if (summary && !summary.gasolineClassPreviouslyRetained) {
        summary.gasolineClassPreviouslyRetained = 0
      }

      if (summary && !summary.gasolineClassObligation) {
        summary.gasolineClassObligation = 0
      }

      if (summary && !summary.creditsOffset) {
        summary.creditsOffset = 0
      }

      const {
        totalPreviousCreditReductions
      } = report.item

      if (summary && !summary.creditsOffsetA) {
        summary.creditsOffsetA = totalPreviousCreditReductions
      }

      if (summary && !summary.creditsOffsetB) {
        summary.creditsOffsetB = 0
      }

      if (summary && !summary.creditsOffsetC) {
        summary.creditsOffsetC = 0
      }

      this.props.recomputeTotals({
        id,
        state: {
          ...schedules,
          summary: {
            ...summary
          }
        }
      })
    }
  }

  _showPenaltyWarning (bool) {
    this.setState({
      ...this.state,
      showPenaltyWarning: bool
    })
  }

  _validate (_payload) {
    if (this.props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.MANAGE)) {
      const payload = _payload
      if (payload.state && payload.state.summary) {
        const { summary } = payload.state

        payload.state.summary = ComplianceReportingEditContainer.cleanSummaryValues(summary)
      }

      return this.props.validateComplianceReport(payload)
    }

    return false
  }

  render () {
    const TabComponent = this.tabComponent

    const { tab, id } = this.props.params
    const { item } = this.props.complianceReporting

    if (!this.state.getCalled) {
      return (<Loading />)
    }

    if (this.props.complianceReporting.isGetting || this.props.complianceReporting.isFinding) {
      return (<Loading />)
    }

    if (this.props.complianceReporting.snapshotIsLoading) {
      return (<Loading />)
    }

    if (!item) {
      return (<Loading />)
    }

    let period = null
    if (typeof (item.compliancePeriod) === 'string') {
      period = item.compliancePeriod
    } else {
      period = item.compliancePeriod.description
    }

    let organizationAddress = null
    if (item && item.organization && item.organization.organizationAddress) {
      organizationAddress = item.organization.organizationAddress
    }

    return ([
      <h2 className="schedule-header" key="main-header">
        {item.organization.name}
        {' -- '}
        {typeof item.type === 'string' && item.type}
        {item.type.theType}
        {' for '}
        {typeof item.compliancePeriod === 'string' && item.compliancePeriod}
        {item.compliancePeriod.description}
      </h2>,
      <h3 className="schedule-available-credit-balance" key="available-credit-balance-excluding-reserved">
        Available Credit Balance for this compliance period:
        {` ${numeral(Math.min(item.maxCreditOffsetExcludeReserved, item.maxCreditOffset)).format(NumberFormat.INT)} `}
        <Tooltip
          className="info"
          placement="bottom"
          show
          title="The Available Credit Balance is the amount of credits in your credit balance
          that can be used to offset outstanding debits in the compliance period for which this
          report relates. Available credits include: (1) validated credits that were generated
          from the supply of Part 3 fuel in this compliance period or in previous compliance
          periods; and (2) credits issued under Part 3 Agreements or acquired through Credit
          Transfers on or before the March 31 deadline of the calendar year following the
          compliance period for which this report relates. Credits that are In Reserve (i.e.
            pending a credit transaction) are not considered available and are therefore not
            included in the Available Credit Balance."
        >
          <FontAwesomeIcon icon="info-circle" />
        </Tooltip>
      </h3>,
      <br key="break"/>,
      <p className="schedule-organization-address" key="organization-address">
        {organizationAddress
          ? ['Head Office: ', AddressBuilder({
              address_line_1: organizationAddress.addressLine1,
              address_line_2: organizationAddress.addressLine2,
              city: organizationAddress.city,
              state: organizationAddress.state,
              postal_code: organizationAddress.postalCode,
              country: organizationAddress.country
            })]
          : null
        }
      </p>,
      <p className="schedule-organization-address" key="organization-attorney-address">
      {organizationAddress && atLeastOneAttorneyAddressFieldExists(organizationAddress)
        ? ['B.C. Attorney Office: ',
            organizationAddress.attorneyRepresentativename ? organizationAddress.attorneyRepresentativename + ', ' : '',
            AddressBuilder({
              address_line_1: organizationAddress.attorneyStreetAddress,
              address_line_2: organizationAddress.attorneyAddressOther,
              city: organizationAddress.attorneyCity,
              state: organizationAddress.attorneyProvince,
              postal_code: organizationAddress.attorneyPostalCode,
              country: organizationAddress.attorneyCountry
            })
          ]
        : null
      }
    </p>,
    <p className="schedule-organization-address" key="organization-attorney-address">
      {organizationAddress && atLeastOneAttorneyAddressFieldExists(organizationAddress) && this.props.loggedInUser.isGovernmentUser ? (
        <>
          Company Profile, EDRMS Record #: {item.organization.edrmsRecord || ''}
        </>
      ) : null}
    </p>,
      <ScheduleTabs
        active={tab}
        compliancePeriod={period}
        complianceReport={this.props.complianceReporting.item}
        edit={this.edit}
        hasSnapshot={item.hasSnapshot}
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
        readOnly={item.readOnly || !this.props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.MANAGE)}
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
        id={this.props.params.id}
        actions={item.actions}
        actor={item.actor}
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
            Ministry of Energy, Mines and Low Carbon Innovation; cheques or money orders
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
                <ReactMarkdown>
                  {assertion.description.substr(1)}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {this.state.supplementalNoteRequired &&
          <div>
            <hr />
            <label htmlFor="supplementalReasonInput">
              Supplemental Report Reason (Required)
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
    ])
  }
}

ComplianceReportingEditContainer.defaultProps = {
  complianceReporting: {
    isCreating: false,
    success: false
  },
  loadedState: null
}

ComplianceReportingEditContainer.propTypes = {
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  complianceReporting: PropTypes.shape({
    errorMessage: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
      PropTypes.shape()
    ]),
    isCreating: PropTypes.bool,
    isGetting: PropTypes.bool,
    isRemoving: PropTypes.bool,
    isUpdating: PropTypes.bool,
    isFinding: PropTypes.bool,
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
      id: PropTypes.number,
      isSupplemental: PropTypes.bool,
      totalPreviousCreditReductions: PropTypes.number,
      maxCreditOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      organization: PropTypes.shape({
        name: PropTypes.string,
        organizationAddress: PropTypes.shape()
      }),
      readOnly: PropTypes.bool,
      status: PropTypes.shape(),
      type: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.string
      ]),
      maxCreditOffsetExcludeReserved: PropTypes.number
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
  getUpdatedLoggedInUser: PropTypes.func.isRequired,
  invalidateAutosaved: PropTypes.func.isRequired,
  loadedState: PropTypes.shape(),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      organizationAddress: PropTypes.shape()
    }),
    title: PropTypes.string
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string,
    period: PropTypes.string,
    tab: PropTypes.string
  }).isRequired,
  recomputeTotals: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  signingAuthorityAssertions: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool
  }).isRequired,
  updateComplianceReport: PropTypes.func.isRequired,
  updateStateToSave: PropTypes.func.isRequired,
  validateComplianceReport: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
}

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
    validateComplianceReport: complianceReporting.validate,
    getUpdatedLoggedInUser
  }

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
  })

const
  config = {
    key: '-',
    version: 4,
    name: 'compliance-report',
    customPathGenerator: props => (props.location.pathname)
  }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(autosaved(config)(ComplianceReportingEditContainer)))
