/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import {
  addOrganization,
  getOrganization,
  updateOrganization
} from '../actions/organizationActions'
import { getUpdatedLoggedInUser } from '../actions/userActions'
import Loading from '../app/components/Loading'
import OrganizationEditForm from './components/OrganizationEditForm'
import toastr from '../utils/toastr'
import ORGANIZATION from '../constants/routes/Organizations'
import Modal from '../app/components/Modal'
import PERMISSIONS_ORGANIZATIONS from '../constants/permissions/Organizations'
import { withRouter } from '../utils/withRouter'

class OrganizationEditContainer extends Component {
  constructor (props) {
    super(props)

    this.att_province = 'BC'
    this.att_country = 'Canada'

    this.state = {
      fields: {
        org_name: '',
        org_addressLine1: '',
        org_addressLine2: '',
        org_city: '',
        org_postalCode: '',
        org_state: '',
        org_country: '',
        org_type: 2,
        org_actionsType: 1,
        org_status: 1,
        att_representativeName: '',
        att_streetAddress: '',
        att_otherAddress: '',
        att_city: '',
        att_province: this.att_province,
        att_country: this.att_country,
        att_postalCode: '',
        edrms_record: ''
      },
      formIsValid: false,
      edrmsRecordError: '',
      formIsDirty: false
    }

    this.submitted = false

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleCreate = this._handleCreate.bind(this)
    this._handleUpdate = this._handleUpdate.bind(this)
  }

  componentDidMount () {
    if (this.props.mode === 'add') {
      return
    }

    this.loadData(this.props.params.id)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.fields !== this.state.fields) {
      this.setState({
        formIsValid: this._formIsValid()
      })
    }
  }

  UNSAFE_componentWillReceiveProps (props) {
    if (props.mode === 'add') {
      return
    }

    this.loadPropsToFieldState(props)
  }

  loadData (id) {
    this.props.getOrganization(id)
  }

  loadPropsToFieldState (props) {
    if (
      Object.keys(props.organization.details).length !== 0 &&
      !this.submitted &&
      !this.state.formIsDirty
    ) {
      const org = props.organization.details
      let addr = {}

      if (org.organizationAddress != null) {
        addr = {
          ...org.organizationAddress
        }
      }
      const edrmsRecord = org.edrmsRecord || ''
      const isEdrmsRecordValid = this._validateEdrmsRecord(edrmsRecord)
      this.setState({
        fields: {
          org_name: props.organization.details.name,
          org_status: props.organization.details.status,
          org_actionsType: props.organization.details.actionsType,
          org_type: props.organization.details.type,
          org_addressLine1: addr.addressLine1,
          org_addressLine2: addr.addressLine2,
          org_city: addr.city,
          org_state: addr.state,
          org_country: addr.country,
          org_postalCode: addr.postalCode,
          att_representativeName: addr.attorneyRepresentativename,
          att_streetAddress: addr.attorneyStreetAddress,
          att_otherAddress: addr.attorneyAddressOther,
          att_city: addr.attorneyCity,
          att_province: this.att_province,
          att_country: this.att_country,
          att_postalCode: addr.attorneyPostalCode,
          edrms_record: isEdrmsRecordValid ? edrmsRecord : ''
        }
      })
    }
  }

  _modalConfirm () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._handleCreate()
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to create this organization?
      </Modal>
    )
  }
  _validateEdrmsRecord(value) {
    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      return 'Only letters and numbers are allowed.'
    }
    return value
  }

  _handleInputChange (event) {
    const { value, name } = event.target
    const fieldState = { ...this.state.fields }
    const numericFields = ['org_type', 'org_actionsType', 'org_status']

    if (numericFields.includes(name)) {
      fieldState[name] = parseInt(value, 10)
    } else {
      fieldState[name] = value
    }
    if (name === 'edrms_record') {
      const isValidEdrmsRecord = /^[a-zA-Z0-9]*$/.test(value);
      if (isValidEdrmsRecord) {
        fieldState[name] = value
        this.setState({
          edrmsRecordError: '',
        });
      } else {
        this.setState({
          edrmsRecordError: 'Only letters and numbers characters are allowed.',
        });
      }
    } else {
      this.setState({
        fields: fieldState,
      })
    }
    this.setState({
      fields: fieldState,
      formIsDirty: true
    })
  }

  _formIsValid () {
    if (!this.state.fields.org_name) {
      return false
    }
    if (!this.state.fields.org_addressLine1) {
      return false
    }
    if (!this.state.fields.org_city) {
      return false
    }
    if (!this.state.fields.org_state) {
      return false
    }
    if (!this.state.fields.org_country) {
      return false
    }
    if (!this.state.fields.org_postalCode) {
      return false
    }
    if (this.state.fields.att_representativeName || this.state.fields.att_streetAddress || this.state.fields.att_otherAddress || this.state.fields.att_city || this.state.fields.att_postalCode) {
      if (!this.state.fields.att_representativeName) {
        return false
      }
      if (!this.state.fields.att_streetAddress) {
        return false
      }
      if (!this.state.fields.att_city) {
        return false
      }
      if (!this.state.fields.att_postalCode) {
        return false
      }
    }
    return true
  }

  _handleUpdate (event) {
    event.preventDefault()

    const data = {
      name: this.state.fields.org_name,
      type: this.state.fields.org_type,
      actionsType: this.state.fields.org_actionsType,
      status: this.state.fields.org_status,
      organizationAddress: {
        addressLine_1: this.state.fields.org_addressLine1,
        addressLine_2: this.state.fields.org_addressLine2,
        city: this.state.fields.org_city,
        postalCode: this.state.fields.org_postalCode,
        state: this.state.fields.org_state,
        country: this.state.fields.org_country,
        attorney_representativename: this.state.fields.att_representativeName,
        attorney_streetAddress: this.state.fields.att_streetAddress,
        attorney_address_other: this.state.fields.att_otherAddress,
        attorney_city: this.state.fields.att_city,
        attorney_province: this.state.fields.att_province,
        attorney_country: this.state.fields.att_country,
        attorney_postalCode: this.state.fields.att_postalCode
      },
      edrms_record: this.state.fields.edrms_record
    }

    let viewUrl = ORGANIZATION.MINE

    if (
      this.props.loggedInUser.hasPermission(
        PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS
      )
    ) {
      viewUrl = ORGANIZATION.DETAILS.replace(':id', this.props.params.id)
    }

    this.props.updateOrganization(data, this.props.params.id).then(() => {
      // update the session for the logged in user (in case the user information got updated)
      this.props.getUpdatedLoggedInUser()
      this.props.navigate(viewUrl)
      toastr.organizationSuccess()
    })

    return false
  }
  
  _handleCreate () {
    const data = {
      name: this.state.fields.org_name,
      type: this.state.fields.org_type,
      actionsType: this.state.fields.org_actionsType,
      status: this.state.fields.org_status,
      organizationAddress: {
        addressLine_1: this.state.fields.org_addressLine1,
        addressLine_2: this.state.fields.org_addressLine2,
        city: this.state.fields.org_city,
        postalCode: this.state.fields.org_postalCode,
        state: this.state.fields.org_state,
        country: this.state.fields.org_country,
        attorney_representativename: this.state.fields.att_representativeName,
        attorney_streetAddress: this.state.fields.att_streetAddress,
        attorney_address_other: this.state.fields.att_otherAddress,
        attorney_city: this.state.fields.att_city,
        attorney_province: this.state.fields.att_province,
        attorney_country: this.state.fields.att_country,
        attorney_postalCode: this.state.fields.att_postalCode
      },
      edrms_record: this.state.fields.edrms_record
      
    }

    this.props.addOrganization(data).then((id) => {
      const viewUrl = ORGANIZATION.DETAILS.replace(':id', id)
      this.props.navigate(viewUrl)
      toastr.organizationSuccess('Organization created.')
    })

    return false
  }

  render () {
    const isFetching =
      this.props.organization.isFetching ||
      this.props.referenceData.isFetching ||
      !this.props.referenceData.isSuccessful

    if (isFetching) {
      return <Loading />
    }
    switch (this.props.mode) {
      case 'add':
        return [
          <OrganizationEditForm
            fields={this.state.fields}
            handleInputChange={this._handleInputChange}
            handleSubmit={() => ''}
            key="organization-edit-form"
            loggedInUser={this.props.loggedInUser}
            mode={this.props.mode}
            referenceData={this.props.referenceData}
            formIsValid={this.state.formIsValid}
            edrmsRecordError={this.state.edrmsRecordError}
          />,
          this._modalConfirm()
        ]
      case 'gov_edit':
      case 'edit':
        return (
          <OrganizationEditForm
            fields={this.state.fields}
            handleInputChange={this._handleInputChange}
            handleSubmit={this._handleUpdate}
            loggedInUser={this.props.loggedInUser}
            mode={this.props.mode}
            referenceData={this.props.referenceData}
            formIsValid={this.state.formIsValid}
            edrmsRecordError={this.state.edrmsRecordError}
          />
        )
      default:
        return <div />
    }
  }
}

OrganizationEditContainer.defaultProps = {
  match: null,
  organization: null,
  referenceData: null
}

OrganizationEditContainer.propTypes = {
  getUpdatedLoggedInUser: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string
  }),
  organization: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      status: PropTypes.number,
      type: PropTypes.number,
      actionsType: PropTypes.number
    }),
    isFetching: PropTypes.bool
  }),
  referenceData: PropTypes.shape({
    organizationTypes: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.number
      })
    ),
    organizationActionsTypes: PropTypes.arrayOf(
      PropTypes.shape({
        the_type: PropTypes.string,
        id: PropTypes.number
      })
    ),
    organizationStatuses: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        id: PropTypes.number
      })
    ),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }),
  updateOrganization: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  addOrganization: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'admin_edit']).isRequired,
  navigate: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  organization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  },
  referenceData: {
    organizationTypes: state.rootReducer.referenceData.data.organizationTypes,
    organizationStatuses:
      state.rootReducer.referenceData.data.organizationStatuses,
    organizationActionsTypes:
      state.rootReducer.referenceData.data.organizationActionsTypes,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
})

const mapDispatchToProps = (dispatch) => ({
  getOrganization: bindActionCreators(getOrganization, dispatch),
  getUpdatedLoggedInUser: bindActionCreators(getUpdatedLoggedInUser, dispatch),
  updateOrganization: bindActionCreators(updateOrganization, dispatch),
  addOrganization: bindActionCreators(addOrganization, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OrganizationEditContainer))
