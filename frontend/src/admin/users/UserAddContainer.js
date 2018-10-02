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
import { getFuelSuppliers } from '../../actions/organizationActions';
import getRoles from '../../actions/roleActions';
import UserForm from './components/UserForm';
import { USERS } from '../../constants/routes/Admin';
import toastr from '../../utils/toastr';

class UserAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        firstName: '',
        lastName: '',
        bceid: '',
        email: '',
        organization: { id: 0 },
        mobilePhone: '',
        status: 1,
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
    this.loadData();
  }

  loadData () {
    this.props.getFuelSuppliers();
    this.props.getRoles();
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

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event) {
    event.preventDefault();

    // API data structure
    const data = {
      firstName: this.state.fields.firstName,
      lastName: this.state.fields.lastName,
      bceid: this.state.fields.bceid,
      email: this.state.fields.email,
      mobilePhone: this.state.fields.mobilePhone,
      organization: this.state.fields.organization.id,
      roles: this.state.fields.roles.filter(role => role.value).map((role) => {
        if (role.value) {
          return role.id;
        }

        return false;
      }),
      status: this.state.fields.status,
      workPhone: this.state.fields.workPhone
    };

    history.push(USERS.LIST);
    toastr.userSuccess('User created.');

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
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        key="userForm"
        roles={this.props.roles}
        toggleCheck={this._toggleCheck}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event);
        }}
        id="confirmCreate"
        key="confirmCreate"
      >
        Are you sure you want to add this user?
      </Modal>
    ]);
  }
}

UserAddContainer.defaultProps = {
};

UserAddContainer.propTypes = {
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getRoles: PropTypes.func.isRequired,
  roles: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  roles: state.rootReducer.roles
});

const mapDispatchToProps = dispatch => ({
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getRoles: bindActionCreators(getRoles, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAddContainer);
