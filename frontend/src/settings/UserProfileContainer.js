/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { clearUsersRequestError, getLoggedInUser, updateUser } from '../actions/userActions';
import Modal from '../app/components/Modal';
import UserProfileDetails from './components/UserProfileDetails';
import toastr from '../utils/toastr';

class UserProfileContainer extends Component {
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

    this.submitted = false;

    this._addToFields = this._addToFields.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
  }

  componentDidMount () {
    this.props.clearUsersRequestError();
    this.loadData();
  }

  loadData () {
    if (!this.submitted) {
      const fieldState = {
        firstName: this.props.loggedInUser.firstName || '',
        lastName: this.props.loggedInUser.lastName || '',
        bceid: this.props.loggedInUser.authorizationId || '',
        email: this.props.loggedInUser.email || '',
        mobilePhone: this.props.loggedInUser.cellPhone || '',
        status: this.props.loggedInUser.isActive ? 'active' : 'inactive',
        workPhone: this.props.loggedInUser.phone || ''
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
      phone: this.state.fields.workPhone
    };

    const { id } = this.props.loggedInUser;

    this.props.updateUser(id, data).then(() => {
      this.props.getLoggedInUser(); // update the session for the logged in user
      toastr.userSuccess();
    });

    return true;
  }

  render () {
    return ([
      <UserProfileDetails
        addToFields={this._addToFields}
        errors={this.props.errors}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        key="userForm"
        loggedInUser={this.props.loggedInUser}
        title="Edit User Profile"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event);
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to update this profile?
      </Modal>
    ]);
  }
}

UserProfileContainer.defaultProps = {
  errors: {}
};

UserProfileContainer.propTypes = {
  clearUsersRequestError: PropTypes.func.isRequired,
  errors: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string
  ]),
  getLoggedInUser: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    authorizationId: PropTypes.string.isRequired,
    cellPhone: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    lastName: PropTypes.string.isRequired,
    phone: PropTypes.string
  }).isRequired,
  updateUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.userAdmin.error,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  clearUsersRequestError: bindActionCreators(clearUsersRequestError, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  updateUser: bindActionCreators(updateUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);
