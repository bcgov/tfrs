/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUser, updateUser } from '../../actions/userActions';
import Modal from '../../app/components/Modal';
import Loading from '../../app/components/Loading';
import history from '../../app/History';
import { getFuelSuppliers } from '../../actions/organizationActions';
import { getRoles } from '../../actions/roleActions';
import UserForm from './components/UserForm';
import PERMISSIONS_USERS from '../../constants/permissions/Users';
import { USERS as ADMIN_USERS } from '../../constants/routes/Admin';
import USERS from '../../constants/routes/Users';
import toastr from '../../utils/toastr';

class UserEditContainer extends Component {
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

    this.submitted = false;

    this._addToFields = this._addToFields.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  loadData (id) {
    this.props.getUser(id);
    this.props.getFuelSuppliers();

    if (document.location.pathname.indexOf('/admin/') >= 0) {
      this.props.getRoles({
        government_roles_only: true
      });
    } else {
      this.props.getRoles({
        fuel_supplier_roles_only: true
      });
    }
  }

  loadPropsToFieldState (props) {
    if (!props.user.isFetching && !this.submitted) {
      const fieldState = {
        firstName: props.user.details.firstName || '',
        lastName: props.user.details.lastName || '',
        bceid: props.user.details.keycloakEmail || '',
        email: props.user.details.email || '',
        organization: props.user.details.organization || null,
        mobilePhone: props.user.details.cellPhone || '',
        status: props.user.details.isActive ? 'active' : 'inactive',
        title: props.user.details.title || '',
        workPhone: props.user.details.phone || '',
        roles: props.user.details.roles.map(role => ({
          id: role.id,
          value: true
        }))
      };

      this.setState({
        fields: fieldState
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

    this.submitted = true;

    // API data structure
    const data = {
      cellPhone: this.state.fields.mobilePhone,
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
    };

    const { id } = this.props.user.details;

    let viewUrl = USERS.DETAILS.replace(':id', id);

    if (document.location.pathname.indexOf('/admin/') >= 0) {
      viewUrl = ADMIN_USERS.DETAILS.replace(':id', id);
    }

    this.props.updateUser(id, data).then(() => {
      // redirect
      history.push(viewUrl);
      toastr.userSuccess();
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

    // search for duplicates and get rid of them. they should be very unlikely, but just in case
    const indexesFound = [];
    fieldState.roles.forEach((role) => {
      if (role.id === key) {
        indexesFound.push(role);
      }
    });

    if (indexesFound.length > 1) {
      fieldState.roles.splice(index, 1);
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
    if (this.props.user.isFetching) {
      return <Loading />;
    }

    return ([
      <UserForm
        addToFields={this._addToFields}
        editPrimaryFields={this.props.loggedInUser.hasPermission(PERMISSIONS_USERS.USER_MANAGEMENT)}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        key="userForm"
        loggedInUser={this.props.loggedInUser}
        roles={this.props.roles}
        title="Edit User"
        toggleCheck={this._toggleCheck}
        errors={this.props.user.error}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event);
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to update this user?
      </Modal>
    ]);
  }
}

UserEditContainer.defaultProps = {
  user: {
    details: {},
    error: {},
    isFetching: true
  }
};

UserEditContainer.propTypes = {
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getRoles: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool,
    hasPermission: PropTypes.func
  }).isRequired,
  roles: PropTypes.shape().isRequired,
  user: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number
    }),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  }),
  updateUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  roles: state.rootReducer.roles,
  user: {
    details: state.rootReducer.userViewRequest.user,
    error: state.rootReducer.userViewRequest.error,
    isFetching: state.rootReducer.userViewRequest.isFetching
  },
  error: state.rootReducer.userAdmin.error
});

const mapDispatchToProps = dispatch => ({
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getRoles: bindActionCreators(getRoles, dispatch),
  getUser: bindActionCreators(getUser, dispatch),
  updateUser: bindActionCreators(updateUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEditContainer);
