/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRoles } from '../../actions/roleActions';
import AdminTabs from '../components/AdminTabs';
import RolesPage from './components/RolesPage';

class RolesContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getRoles();
  }

  render () {
    return ([
      <AdminTabs
        active="roles"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <RolesPage
        data={this.props.roles}
        key="roles"
      />
    ]);
  }
}

RolesContainer.defaultProps = {
};

RolesContainer.propTypes = {
  getRoles: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
  roles: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  roles: state.rootReducer.roles
});

const mapDispatchToProps = dispatch => ({
  getRoles: bindActionCreators(getRoles, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RolesContainer);
