import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../actions/userActions.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';

class Navbar extends Component {

  componentDidMount() {
    this.props.getLoggedInUser();
  }

  render() {
    return (
    <div id="header" role="banner">
      <div id="header-main" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div id="header-main-row" className="row">

            <div className="col-sm-3 col-md-2 col-lg-2 header-main-left">
              <div id="logo">
                <a id="gov-logo" href="http://gov.bc.ca"><img src="./assets/images/gov3_bc_logo.png" alt="Province of British Columbia" title="Province of British Columbia logo" /></a>
              </div>
              <div id="access">
                <ul>
                  <li aria-label="Keyboard Tab Skip">
                    <a accessKey="0" href="#main-content-anchor" aria-label="Skip to main content">Skip to main content</a>
                  </li>
                  <li aria-label="Keyboard Tab Skip">
                    <a accessKey="0" href="#navigation-anchor" aria-label="Skip to navigation" aria-label="Skip to navigation">Skip to navigation</a>
                  </li>
                  <li aria-label="Keyboard Tab Skip">
                    <a accessKey="0" href="http://gov.bc.ca/webaccessibility/" aria-label="Accessibility Statement">Accessibility Statement</a>
                  </li>
                </ul>
              </div>
              <button type="button" className="navbar-toggle env-button-custom collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="true" aria-label="Burger Navigation">
                      <img src="./assets/images/menu-open-mobile.png" />
              </button>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 hidden-xs">
              <div className="bcgov-title">
                <h1>Transportation Fuels Reporting System</h1>
              </div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4 hidden-xs">
                  <span id="display_name" className="pull-right">{this.props.loggedInUserData.display_name}</span>
            </div>
            <div id="navbar" className="collapse navbar-collapse" role="navigation">
              <a id="navigation-anchor"></a>
              <ul className="nav navbar-nav">
                <li><Link id="collapse-navbar-dashboard" to={Routes.HOME}>Dashboard</Link></li>
                <li><Link id="collapse-navbar-organization" to={Routes.ORGANIZATIONS}>Fuel Suppliers</Link></li>
			          <li><Link id="collapse-navbar-account-activity" to={Routes.ACCOUNT_ACTIVITY}>Account Activity</Link></li>
				        <li><Link id="collapse-navbar-notifications" to={Routes.NOTIFICATIONS}>Notifications</Link></li>
                <li><Link id="collapse-navbar-settings" to={Routes.SETTINGS}>Settings</Link></li>
                <li><Link id="collapse-navbar-administration" to={Routes.ADMINISTRATION}>Administration</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="navigationRibbon hidden-xs">
          <div className="level2Navigation">
            <div className="container">
              <Link id="navbar-dashboard" to={Routes.HOME}>Dashboard</Link>
              <Link id="navbar-organizations" to={Routes.ORGANIZATIONS}>Fuel Suppliers</Link>
              <Link id="navbar-account-activity" to={Routes.ACCOUNT_ACTIVITY}>Account Activity</Link>
              <Link id="navbar-notifications" to={Routes.NOTIFICATIONS}>Notifications</Link>
              <Link id="navbar-settings" to={Routes.SETTINGS}>Settings</Link>
              <Link id="navbar-administration" to={Routes.ADMINISTRATION}>Administration</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default connect (
  state => ({
    loggedInUserData: state.rootReducer[ReducerTypes.GET_LOGGED_IN_USER].data,
  }),
  dispatch => ({
    getLoggedInUser: () => {
      dispatch(getLoggedInUser());
    },
  })
)(Navbar)
