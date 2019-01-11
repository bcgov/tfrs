/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from '../../app/components/Modal';
import history from '../../app/History';
import { getFuelSuppliers, getOrganization } from '../../actions/organizationActions';
import { getRoles } from '../../actions/roleActions';
import UserForm from './components/UserForm';
import { USERS } from '../../constants/routes/Admin';
import toastr from '../../utils/toastr';
import { clearUsersRequestError, createUser } from '../../actions/userActions';

class UserAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        firstName: '',
        lastName: '',
        bceid: '',
        email: '',
        organization: null,
        mobilePhone: '',
        status: 'active',
        title: '',
        workPhone: '',
        roles: []
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.props.clearUsersRequestError();
    this.loadData();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.organization.id !== this.props.organization.id) {
      this.setState({
        fields: {
          ...this.state.fields,
          organization: nextProps.organization
        }
      });
    }
  }

  loadData () {
    if (this.props.match.params.organizationId) {
      this.props.getOrganization(this.props.match.params.organizationId);
    } else {
      this.props.getFuelSuppliers();
    }

    if (document.location.pathname.indexOf('/admin/') >= 0) {
      this.props.getRoles({
        government_roles_only: true
      });

      this.setState({
        fields: {
          ...this.state.fields,
          organization: {
            id: 1
          }
        }
      });
    } else {
      this.props.getRoles({
        fuel_supplier_roles_only: true
      });
    }
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    if (value &&
      fieldState.roles.findIndex(role => (role.id === value.id)) < 0) {
      fieldState.roles.push(value);
    }

    this.setState({
      fields: fieldState
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    fieldState[name] = value;
    this.setState({
      fields: fieldState
    });
  }

  _handleSubmit (event) {
    event.preventDefault();

    // API data structure
    const data = {
      user: {
        cellPhone: this.state.fields.mobilePhone,
        username: 'user' + (new Date().getTime()),
        email: this.state.fields.email,
        firstName: this.state.fields.firstName,
        lastName: this.state.fields.lastName,
        organization: this.state.fields.organization ? this.state.fields.organization.id : null,
        phone: this.state.fields.workPhone,
        roles: this.state.fields.roles.filter(role => role.value).map((role) => {
          if (role.value) {
            return role.id;
          }

          return false;
        }),
        is_active: this.state.fields.status === 'active',
        title: this.state.fields.title
      },
      email: this.state.fields.bceid
    };

    this.props.createUser(data).then(() => {
      history.push(USERS.DETAILS_BY_USERNAME.replace(':username', this.props.createdUsername));
      toastr.userSuccess('User created.');
    });

    return true;
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.roles.findIndex(role => role.id === key);

    if (index < 0) {
      fieldState.roles.push({
        id: key,
        value: true
      });
    } else {
      fieldState.roles[index].value = !fieldState.roles[index].value;
    }

    this.setState({
      fields: fieldState
    });
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  render () {
    return ([
      <UserForm
        addToFields={this._addToFields}
        editPrimaryFields
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
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
          this._handleSubmit(event);
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this user?
      </Modal>
    ]);
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
};

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
  loggedInUser: PropTypes.shape({
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      organizationId: PropTypes.string
    })
  }),
  organization: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })
};

const mapStateToProps = state => ({
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  roles: state.rootReducer.roles,
  error: state.rootReducer.userAdmin.error,
  createdUsername: state.rootReducer.userAdmin.user
    .hasOwnProperty('user') ? state.rootReducer.userAdmin.user.user.username : null,
  organization: state.rootReducer.organizationRequest.fuelSupplier
});

const mapDispatchToProps = dispatch => ({
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getOrganization: bindActionCreators(getOrganization, dispatch),
  getRoles: bindActionCreators(getRoles, dispatch),
  clearUsersRequestError: bindActionCreators(clearUsersRequestError, dispatch),
  createUser: bindActionCreators(createUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAddContainer);
