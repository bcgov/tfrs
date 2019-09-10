/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import DashboardPage from './components/DashboardPage';

class DashboardContainer extends Component {
  componentDidMount () {
  }

  componentWillReceiveProps (nextProps, nextContext) {
  }

  render () {
    return <DashboardPage />;
  }
}

DashboardContainer.defaultProps = {
};

DashboardContainer.propTypes = {
};

const mapDispatchToProps = {};

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((DashboardContainer));
