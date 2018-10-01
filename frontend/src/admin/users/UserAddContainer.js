/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getRoles from '../../actions/roleActions';

import UserForm from './components/UserForm';

class UserAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        roles: []
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
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

  render () {
    return (
      <UserForm
        addToFields={this._addToFields}
        fields={this.state.fields}
        roles={this.props.roles}
        toggleCheck={this._toggleCheck}
      />
    );
  }
}

UserAddContainer.defaultProps = {
};

UserAddContainer.propTypes = {
  getRoles: PropTypes.func.isRequired,
  roles: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  roles: state.rootReducer.roles
});

const mapDispatchToProps = dispatch => ({
  getRoles: bindActionCreators(getRoles, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAddContainer);
