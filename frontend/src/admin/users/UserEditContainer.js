/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUser } from '../../actions/userActions';
import Modal from '../../app/components/Modal';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import { getFuelSuppliers } from '../../actions/organizationActions';
import getRoles from '../../actions/roleActions';
import UserForm from './components/UserForm';
import USERS from '../../constants/routes/Users';
import { USERS as ADMIN_USERS } from '../../constants/routes/Admin';
import toastr from '../../utils/toastr';
import {updateUser} from "../../actions/userActions";


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
        workPhone: '',
        roles: []
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentWillMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
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
    if (!props.user.isFetching) {
      const fieldState = {
        firstName: props.user.details.firstName || '',
        lastName: props.user.details.lastName || '',
        bceid: props.user.details.authorizationId || '',
        email: props.user.details.email || '',
        organization: props.user.details.organization || null,
        mobilePhone: props.user.details.cellPhone || '',
        status: props.user.details.isActive ? 'active' : 'inactive',
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
      is_active: this.state.fields.status === 'active'
    };

    const { id } = this.props.user.details;

    console.log(data);

    let viewUrl = USERS.DETAILS.replace(':id', id);

    if (document.location.pathname.indexOf('/admin/') >= 0) {
      viewUrl = ADMIN_USERS.DETAILS.replace(':id', id);
    }

    this.props.updateUser(id, data).then(() => {
      //redirect
      history.push(viewUrl);
      toastr.userSuccess();
    }).catch(error => {});

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
    if (this.props.user.isFetching) {
      return <Loading />;
    }

    return ([
      <UserForm
        addToFields={this._addToFields}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        key="userForm"
        loggedInUser={this.props.loggedInUser}
        roles={this.props.roles}
        title="Edit User"
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
  }).isRequired,
  roles: PropTypes.shape().isRequired,
  user: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number
    }),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  }),
  updateUser: PropTypes.func.isRequired,
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
