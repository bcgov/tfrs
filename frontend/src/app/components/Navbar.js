import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { getNotifications } from '../../actions/notificationActions';
import history from '../../app/History';
import * as Routes from '../../constants/routes';
import { HISTORICAL_DATA_ENTRY } from '../../constants/routes/Admin';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import { signUserOut } from '../../actions/userActions';
import CONFIG from '../../config';

class Navbar extends Component {
  static updateContainerPadding () {
    const headerHeight = document.getElementById('header-main').clientHeight;
    const topSpacing = 30;
    const totalSpacing = headerHeight + topSpacing;
    document.getElementById('main').setAttribute('style', `padding-top: ${totalSpacing}px;`);
  }

  componentDidMount () {
    this.props.getNotifications(); // ensure that the notifications are up-to-date
    Navbar.updateContainerPadding();
    window.addEventListener('resize', () => Navbar.updateContainerPadding());
  }

  componentDidUpdate () {
    Navbar.updateContainerPadding();
  }

  render () {
    let unreadCount = 0;

    if (this.props.unreadNotificationsCount > 0 && this.props.unreadNotificationsCount < 1000) {
      unreadCount = this.props.unreadNotificationsCount;
    }

    if (this.props.unreadNotificationsCount > 1000) {
      unreadCount = '∞';
    }

    const SecondLevelNavigation = (
      <div className="level2Navigation">
        <div className="container">
          {this.props.loggedInUser.isGovernmentUser &&
          <NavLink
            activeClassName="active"
            id="navbar-organizations"
            isActive={(match, location) => {
              if (match || (location.pathname.indexOf('/users/') === 0 &&
                location.pathname.indexOf('/admin/') < 0)) {
                return true;
              }

              return false;
            }}
            to={ORGANIZATIONS.LIST}
          >
            Fuel Suppliers
          </NavLink>
          }
          {!this.props.loggedInUser.isGovernmentUser &&
          [
            <a
              href={ORGANIZATIONS.BULLETIN}
              key="bulletin"
              rel="noopener noreferrer"
              target="_blank"
            >
              Fuel Suppliers
            </a>,
            <NavLink
              activeClassName="active"
              id="navbar-credit-transactions"
              isActive={(match, location) => {
                if (match || location.pathname.indexOf('/users/') === 0) {
                  return true;
                }

                return false;
              }}
              key="company-details"
              to={ORGANIZATIONS.MINE}
            >
              Company Details
            </NavLink>,
            <a
              href={ORGANIZATIONS.CREDIT_MARKET_REPORT}
              key="credit-market-report"
              rel="noopener noreferrer"
              target="_blank"
            >
              Credit Market Report
            </a>
          ]
          }
          <NavLink
            activeClassName="active"
            id="navbar-credit-transactions"
            to={CREDIT_TRANSACTIONS.LIST}
          >
            Credit Transactions
          </NavLink>
          <NavLink
            activeClassName="active"
            id="navbar-secure-document-upload"
            to={SECURE_DOCUMENT_UPLOAD.LIST}
          >
            Secure Document Upload
          </NavLink>
          {this.props.loggedInUser.isGovernmentUser &&
          <NavLink
            activeClassName="active"
            id="navbar-administration"
            isActive={(match, location) => {
              if (location.pathname.indexOf('/admin/') >= 0) {
                return true;
              }

              return false;
            }}
            to={HISTORICAL_DATA_ENTRY.LIST}
          >
            Administration
          </NavLink>
          }
          <NavLink
            activeClassName="active"
            id="navbar-notifications"
            to={Routes.NOTIFICATIONS.LIST}
          >
            <span className="fa-layers">
              <FontAwesomeIcon icon="bell" />
              {unreadCount > 0 &&
                <span className="fa-layers-counter">{unreadCount}</span>
              }
            </span>
          </NavLink>
        </div>
      </div>
    );

    const CollapsedNavigation = (
      <div
        id="navbar"
        className="collapse navbar-collapse"
        role="navigation"
      >
        <a id="navigation-anchor" href="#navigation-anchor"><span>Navigation Bar</span></a>
        <ul className="nav navbar-nav">
          {this.props.loggedInUser.isGovernmentUser &&
          <li>
            <NavLink
              id="collapse-navbar-organization"
              isActive={(match, location) => {
                if (match || location.pathname.indexOf('/users/') === 0) {
                  return true;
                }

                return false;
              }}
              to={ORGANIZATIONS.LIST}
            >
              Fuel Suppliers
            </NavLink>
          </li>
          }
          {!this.props.loggedInUser.isGovernmentUser &&
          [
            <li key="bulletin">
              <a
                href={ORGANIZATIONS.BULLETIN}
                rel="noopener noreferrer"
                target="_blank"
              >
                Fuel Suppliers
              </a>
            </li>,
            <li key="company-details">
              <NavLink
                id="navbar-credit-transactions"
                isActive={(match, location) => {
                  if (match || location.pathname.indexOf('/users/') === 0) {
                    return true;
                  }

                  return false;
                }}
                to={ORGANIZATIONS.MINE}
              >
                Company Details
              </NavLink>,
            </li>,
            <li key="credit-market-report">
              <a
                href={ORGANIZATIONS.CREDIT_MARKET_REPORT}
                rel="noopener noreferrer"
                target="_blank"
              >
                Credit Market Report
              </a>
            </li>
          ]
          }
          <li>
            <NavLink
              activeClassName="active"
              id="collapse-navbar-credit-transactions"
              to={CREDIT_TRANSACTIONS.LIST}
            >
            Credit Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="active"
              id="collapse-navbar-secure-document-upload"
              to={SECURE_DOCUMENT_UPLOAD.LIST}
            >
              Secure Document Upload
            </NavLink>
          </li>
          {this.props.loggedInUser.isGovernmentUser &&
          <li>
            <NavLink
              id="collapse-navbar-administration"
              isActive={(match, location) => {
                if (location.pathname.indexOf('/admin/') >= 0) {
                  return true;
                }

                return false;
              }}
              to={HISTORICAL_DATA_ENTRY.LIST}
            >
              Administration
            </NavLink>
          </li>
          }
          <li>
            <NavLink
              activeClassName="active"
              id="navbar-notifications"
              to={Routes.NOTIFICATIONS.LIST}
            >
                Notifications
              {unreadCount > 0 &&
                <span> ({unreadCount})</span>
              }
            </NavLink>
          </li>
          <li>
            <NavLink id="navbar-settings" to={Routes.SETTINGS}>
              Settings
            </NavLink>
          </li>
          <li>
            {CONFIG.KEYCLOAK.ENABLED &&
            <NavLink
              id="navbar-logout"
              onClick={(e) => { e.preventDefault(); this.props.dispatch(signUserOut()); }}
              to={Routes.LOGOUT}
            >
              Log Out
            </NavLink>
            }
            {CONFIG.KEYCLOAK.ENABLED ||
            <NavLink id="navbar-logout" to={Routes.LOGOUT}>
              Log Out
            </NavLink>
            }

          </li>
        </ul>
      </div>);

    return (
      <div id="header" role="banner">
        <div id="header-main" className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div id="header-main-row" className="row">
              <div className="col-sm-3 col-md-2 col-lg-2 header-main-left">
                <div id="logo">
                  <a href="http://gov.bc.ca">
                    <img
                      src="/assets/images/gov3_bc_logo.png"
                      alt="Province of British Columbia"
                      title="Province of British Columbia logo"
                    />
                  </a>
                </div>
                <div id="access">
                  <ul>
                    <li aria-label="Keyboard Tab Skip">
                      <a
                        href="#main-content-anchor"
                        aria-label="Skip to main content"
                      >
                        Skip to main content
                      </a>
                    </li>
                    <li aria-label="Keyboard Tab Skip">
                      <a
                        href="#navigation-anchor"
                        aria-label="Skip to navigation"
                      >
                        Skip to navigation
                      </a>
                    </li>
                    <li aria-label="Keyboard Tab Skip">
                      <a
                        href="http://gov.bc.ca/webaccessibility/"
                        aria-label="Accessibility Statement"
                      >
                        Accessibility Statement
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="navbar-toggle env-button-custom collapsed"
                  data-toggle="collapse"
                  data-target="#navbar"
                  aria-expanded="true"
                  aria-label="Burger Navigation"
                >
                  <img src="/assets/images/menu-open-mobile.png" alt="menu" />
                </button>
              </div>
              <div className="col-sm-5 col-md-6 col-lg-6 hidden-xs">
                <div className="bcgov-title">
                  <h1>Transportation Fuels Reporting System</h1>
                </div>
              </div>
              <div className="col-sm-4 col-md-4 col-lg-4 hidden-xs">
                <div className="pull-right">
                  <h5 id="display_name">
                    {this.props.loggedInUser.displayName &&
                      <DropdownButton
                        className="display-name-button"
                        id="display-name-button"
                        pullRight
                        title={this.props.loggedInUser.displayName}
                      >
                        <MenuItem className="dropdown-menu-caret" header>
                          <FontAwesomeIcon icon="caret-up" size="2x" />
                        </MenuItem>
                        <MenuItem onClick={() => {
                          history.push(Routes.SETTINGS);
                        }}
                        >
                          <FontAwesomeIcon icon="cog" /> Settings
                        </MenuItem>
                        {CONFIG.KEYCLOAK.ENABLED &&
                        <MenuItem onClick={(e) => {
                          e.preventDefault(); this.props.dispatch(signUserOut());
                        }}
                        >
                          <FontAwesomeIcon icon="sign-out-alt" /> Log Out
                        </MenuItem>
                        }
                        {CONFIG.KEYCLOAK.ENABLED ||
                        <MenuItem href={Routes.LOGOUT}>
                          <FontAwesomeIcon icon="sign-out-alt" /> Log Out
                        </MenuItem>
                        }
                      </DropdownButton>
                    }
                  </h5>
                  <span id="user_organization">
                    {this.props.loggedInUser.organization &&
                      this.props.loggedInUser.organization.name}
                  </span>
                </div>
              </div>
              { this.props.isAuthenticated && CollapsedNavigation }
            </div>
          </div>
          <div className="navigationRibbon hidden-xs">
            { this.props.isAuthenticated && SecondLevelNavigation }
          </div>
        </div>
      </div>
    );
  }
}

Navbar.defaultProps = {
  dispatch: null,
  unreadNotificationsCount: null
};

Navbar.propTypes = {
  dispatch: PropTypes.func,
  getNotifications: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    }))
  }).isRequired,
  unreadNotificationsCount: PropTypes.number
};

const mapDispatchToProps = dispatch => ({
  getNotifications: bindActionCreators(getNotifications, dispatch)
});

// export default Navbar;
export default connect(state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  isAuthenticated: state.rootReducer.userRequest.isAuthenticated
}), mapDispatchToProps, null, {
  pure: false
})(Navbar);
