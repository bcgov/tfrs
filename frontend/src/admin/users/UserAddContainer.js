/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Modal from '../../app/components/Modal'
import { getFuelSuppliers, getOrganization } from '../../actions/organizationActions'
import { roles } from '../../actions/roleActions'
import UserForm from './components/UserForm'
import { USERS as ADMIN_USERS } from '../../constants/routes/Admin'
import USERS from '../../constants/routes/Users'
import toastr from '../../utils/toastr'
import { clearUsersRequestError, createUser } from '../../actions/userActions'
import { withRouter } from '../../utils/withRouter'

class UserAddContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        organization: null,
        organizationName: '',
        mobilePhone: '',
        status: 'active',
        title: '',
        userCreationRequest: {
          keycloakEmail: '',
          externalUsername: ''
        },
        workPhone: '',
        roles: []
      }
    }

    this._addToFields = this._addToFields.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleOrganizationSelect = this._handleOrganizationSelect.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._toggleCheck = this._toggleCheck.bind(this)
  }

  componentDidMount () {
    this.props.clearUsersRequestError()
    this.loadData()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.organization.id !== this.props.organization.id) {
      this.setState({
        fields: {
          ...this.state.fields,
          organization: nextProps.organization
        }
      })
    }
  }

  loadData () {
    if (this.props.params.organizationId) {
      this.props.getOrganization(this.props.params.organizationId)
    } else {
      this.props.getFuelSuppliers()
    }

    if (document.location.pathname.indexOf('/admin/') >= 0) {
      this.props.getRoles({
        government_roles_only: true
      })

      this.setState({
        fields: {
          ...this.state.fields,
          organization: {
            id: 1
          }
        }
      })
    } else {
      this.props.getRoles({
        fuel_supplier_roles_only: true
      })
    }
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields }

    if (value &&
      fieldState.roles.findIndex(role => (role.id === value.id)) < 0) {
      fieldState.roles.push(value)
    }

    this.setState({
      fields: fieldState
    })
  }

  _handleInputChange (event) {
    const { value, name } = event.target
    const fieldState = { ...this.state.fields }

    if (['keycloakEmail', 'externalUsername'].indexOf(name) >= 0) {
      fieldState.userCreationRequest[name] = value
    } else {
      fieldState[name] = value
    }

    this.setState({
      fields: fieldState
    })
  }

  _handleOrganizationSelect (organization) {
    const fieldState = { ...this.state.fields }
    fieldState.organization = organization
    fieldState.organizationName = organization.name;
    this.setState({
      fields: fieldState
    })
  }

  _handleSubmit (event) {
    event.preventDefault()

    let email = this.state.fields.userCreationRequest.keycloakEmail

    if (this.state.fields.email) {
      ({ email } = this.state.fields)
    }

    // API data structure
    const data = {
      user: {
        cellPhone: this.state.fields.mobilePhone,
        username: `user${(new Date().getTime())}`,
        email,
        firstName: this.state.fields.firstName,
        lastName: this.state.fields.lastName,
        organization: this.state.fields.organization ? this.state.fields.organization.id : null,
        phone: this.state.fields.workPhone,
        roles: this.state.fields.roles.filter(role => role.value).map((role) => {
          if (role.value) {
            return role.id
          }

          return false
        }),
        is_active: this.state.fields.status === 'active',
        title: this.state.fields.title
      },
      email: this.state.fields.userCreationRequest.keycloakEmail,
      username: this.state.fields.userCreationRequest.externalUsername
    }

    this.props.createUser(data).then(() => {
      let viewUrl = USERS.DETAILS_BY_USERNAME.replace(':username', this.props.createdUsername)

      if (document.location.pathname.indexOf('/admin/') >= 0) {
        viewUrl = ADMIN_USERS.DETAILS_BY_USERNAME.replace(':username', this.props.createdUsername)
      }

      this.props.navigate(viewUrl)
      toastr.userSuccess('User created.')
    })

    return true
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields }
    const index = fieldState.roles.findIndex(role => role.id === key)

    if (index < 0) {
      fieldState.roles.push({
        id: key,
        value: true
      })
    } else {
      fieldState.roles[index].value = !fieldState.roles[index].value
    }

    this.setState({
      fields: fieldState
    })
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields }

    fieldState[name] = { id: id || 0 }
    this.setState({
      fields: fieldState
    })
  }

  render () {
    return ([
      <UserForm
        addToFields={this._addToFields}
        editPrimaryFields
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleOrganizationSelect={this._handleOrganizationSelect}
        isAdding
        key="userForm"
        loggedInUser={this.props.loggedInUser}
        roles={this.props.roles}
        title="New User"
        toggleCheck={this._toggleCheck}
        errors={this.props.error}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event)
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this user?
      </Modal>
    ])
  }
}

UserAddContainer.defaultProps = {
  createdUsername: null,
  error: {},
  match: {
    params: {
      organizationId: null
    }
  },
  organization: {
    id: null
  }
}

UserAddContainer.propTypes = {
  clearUsersRequestError: PropTypes.func.isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  getRoles: PropTypes.func.isRequired,
  roles: PropTypes.shape().isRequired,
  createUser: PropTypes.func.isRequired,
  createdUsername: PropTypes.string,
  error: PropTypes.shape({}),
  loggedInUser: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({
    organizationId: PropTypes.string
  }).isRequired,
  organization: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })
}

const mapStateToProps = state => {
  const hasBarProperty = Object.prototype.hasOwnProperty.call(state.rootReducer.userAdmin.user, 'user')
  return ({
    fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
    loggedInUser: state.rootReducer.userRequest.loggedInUser,
    roles: state.rootReducer.roles,
    error: state.rootReducer.userAdmin.error,
    createdUsername: hasBarProperty
      ? state.rootReducer.userAdmin.user.user.username
      : null,
    organization: state.rootReducer.organizationRequest.fuelSupplier
  })
}

const mapDispatchToProps = {
  getFuelSuppliers,
  getOrganization,
  getRoles: roles.find,
  clearUsersRequestError,
  createUser
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserAddContainer))
