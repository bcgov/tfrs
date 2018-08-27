/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SettingsDetails from './components/SettingsDetails';

class SettingsContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        settings: {
          notifications: []
        }
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentWillMount () {
    this.loadData();
  }

  loadData () {
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    const found = fieldState.settings.notifications.find(state => (
      state.id === value.id && state.type === value.type && state.field === value.field));

    if (!found) {
      fieldState.settings.notifications.push({
        id: value.id,
        field: value.field,
        type: value.type,
        value: value.value
      });
    }

    this.setState({
      fields: fieldState
    });
  }

  _toggleCheck (id, fields) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.settings.notifications.findIndex(state => (
      state.id === id && state.type === fields.type && state.field === fields.field));

    fieldState.settings.notifications[index].value =
        !fieldState.settings.notifications[index].value;

    this.setState({
      fields: fieldState
    });
  }

  render () {
    return (
      <SettingsDetails
        addToFields={this._addToFields}
        fields={this.state.fields}
        toggleCheck={this._toggleCheck}
      />
    );
  }
}

SettingsContainer.propTypes = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
