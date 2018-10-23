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

  componentDidMount () {
    this.loadData();
  }

  loadData () {
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
      bceid: this.state.fields.bceid,
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
      status: this.state.fields.status === 'active'
    };

    console.log(data);

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
        title="New User"
        toggleCheck={this._toggleCheck}
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
