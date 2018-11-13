/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { updateUser } from '../actions/userActions';
import Modal from '../app/components/Modal';
import UserProfileDetails from './components/UserProfileDetails';
import USERS from '../constants/routes/Users';
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

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    if (!this.submitted) {
      const fieldState = {
        firstName: props.loggedInUser.firstName || '',
        lastName: props.loggedInUser.lastName || '',
        bceid: props.loggedInUser.authorizationId || '',
        email: props.loggedInUser.email || '',
        organization: props.loggedInUser.organization || null,
        mobilePhone: props.loggedInUser.cellPhone || '',
        status: props.loggedInUser.isActive ? 'active' : 'inactive',
        workPhone: props.loggedInUser.phone || '',
        roles: props.loggedInUser.roles.map(role => ({
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
      phone: this.state.fields.workPhone
    };

    const { id } = this.props.loggedInUser;

    this.props.updateUser(id, data).then(() => {
      toastr.userSuccess();
    });

    return true;
  }

  render () {
    return ([
      <UserProfileDetails
        addToFields={this._addToFields}
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

UserProfileContainer.propTypes = {
  loggedInUser: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  updateUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  updateUser: bindActionCreators(updateUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);
