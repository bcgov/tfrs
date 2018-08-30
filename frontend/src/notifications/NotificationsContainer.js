/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SettingsDetails from './components/NotificationsDetails';

class NotificationsContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
  }

  render () {
    return (
      <SettingsDetails />
    );
  }
}

NotificationsContainer.propTypes = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
