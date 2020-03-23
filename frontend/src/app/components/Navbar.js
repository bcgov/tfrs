import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { signUserOut } from '../../actions/userActions';
import history from '../../app/History';
import * as NumberFormat from '../../constants/numeralFormats';
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport';
import PERMISSIONS_SECURE_DOCUMENT_UPLOAD from '../../constants/permissions/SecureDocumentUpload';
import * as Routes from '../../constants/routes';
import { FUEL_CODES } from '../../constants/routes/Admin';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import CONFIG from '../../config';

class Navbar extends Component {
  static updateContainerPadding () {
    const headerHeight = document.getElementById('header-main').clientHeight;
    const topSpacing = 30;
    const totalSpacing = headerHeight + topSpacing;
    document.getElementById('main').setAttribute('style', `padding-top: ${totalSpacing}px;`);
  }

  constructor () {
    super();

    this.state = {
      unreadCount: 0
    };
  }

  componentDidMount () {
    Navbar.updateContainerPadding();
    window.addEventListener('resize', () => Navbar.updateContainerPadding());
  }

  componentWillReceiveProps (newProps) {
    if (newProps.unreadNotificationsCount != null) {
      let unreadCount = 0;

      if (newProps.unreadNotificationsCount > 0 && newProps.unreadNotificationsCount < 1000) {
        unreadCount = newProps.unreadNotificationsCount;
      }

      if (unreadCount > 1000) {
        unreadCount = '∞';
      }

      this.setState({
        unreadCount
      });
    }
  }

  componentDidUpdate () {
    Navbar.updateContainerPadding();
  }

  render () {
    const SecondLevelNavigation = (
      <div className="level2Navigation">
        <div className="container-fluid">
          <NavLink
            activeClassName="active"
            id="navbar-home"
            isActive={(match, location) => {
              if ((match && match.isExact) || (location.pathname.indexOf('/dashboard') === 0)) {
                return true;
              }

              return false;
            }}
            to={Routes.HOME}
          >
            Home
          </NavLink>
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
          <NavLink
            activeClassName="active"
            id="navbar-credit-transactions"
            to={CREDIT_TRANSACTIONS.LIST}
          >
            Credit Transactions
          </NavLink>
          {CONFIG.COMPLIANCE_REPORTING.ENABLED &&
          typeof this.props.loggedInUser.hasPermission === 'function' &&
          this.props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW) &&
          !this.props.loggedInUser.isGovernmentUser &&
          <NavLink
            activeClassName="active"
            id="navbar-secure-document-upload"
            to={SECURE_DOCUMENT_UPLOAD.LIST}
          >
            File Submissions
          </NavLink>
          }
          {CONFIG.COMPLIANCE_REPORTING.ENABLED &&
          typeof this.props.loggedInUser.hasPermission === 'function' &&
          this.props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW) &&
          <NavLink
            activeClassName="active"
            id="navbar-compliance-reporting"
            isActive={(match, location) => {
              if (location.pathname.indexOf('/compliance_reporting') >= 0) {
                return true;
              }

              return false;
            }}
            to={COMPLIANCE_REPORTING.LIST}
          >
            Compliance &amp; Exclusion Reports
          </NavLink>
          }
          {CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED &&
          typeof this.props.loggedInUser.hasPermission === 'function' &&
          this.props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW) &&
          this.props.loggedInUser.isGovernmentUser &&
          <NavLink
            activeClassName="active"
            id="navbar-secure-document-upload"
            to={SECURE_DOCUMENT_UPLOAD.LIST}
          >
            File Submissions
          </NavLink>
          }
          {CONFIG.FUEL_CODES.ENABLED &&
          this.props.loggedInUser.isGovernmentUser &&
          <NavLink
            activeClassName="active"
            id="navbar-fuel-codes"
            to={FUEL_CODES.LIST}
          >
            Fuel Codes
          </NavLink>
          }
          {!this.props.loggedInUser.isGovernmentUser &&
          <NavLink
            activeClassName="active"
            className="navbar-item"
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
            Organization Details
          </NavLink>
          }
          <div id="user-options">
            {this.props.loggedInUser.displayName &&
              <div
                className="navbar-item"
                id="display-name"
              >
                <DropdownButton
                  className="display-name-button"
                  id="display-name-button"
                  pullRight
                  title={this.props.loggedInUser.displayName}
                >
                  <MenuItem className="dropdown-menu-caret" header>
                    <FontAwesomeIcon icon="caret-up" size="2x" />
                  </MenuItem>
                  <MenuItem
                    className="dropdown-hidden-item"
                    onClick={() => {
                      history.push(Routes.NOTIFICATIONS.LIST);
                    }}
                  >
                    <FontAwesomeIcon icon="bell" /> Notifications
                    {this.state.unreadCount > 0 &&
                      ` (${this.state.unreadCount}) `
                    }
                  </MenuItem>
                  <MenuItem onClick={() => {
                    history.push(Routes.SETTINGS);
                  }}
                  >
                    <FontAwesomeIcon icon="cog" /> Settings
                  </MenuItem>
                  <MenuItem
                    className="dropdown-hidden-item"
                    href={`/assets/files/Transportation_Fuels_Reporting_System_-_${this.props.loggedInUser.isGovernmentUser ? 'IDIR' : 'BCeID'}_Manual.pdf`}
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={['far', 'question-circle']} /> Help
                  </MenuItem>
                  <MenuItem onClick={(e) => {
                    e.preventDefault();
                    this.props.signUserOut();
                  }}
                  >
                    <FontAwesomeIcon icon="sign-out-alt" /> Log Out
                  </MenuItem>
                </DropdownButton>
              </div>
            }
            <NavLink
              activeClassName="active"
              className="navbar-item"
              id="navbar-notifications"
              to={Routes.NOTIFICATIONS.LIST}
            >
              <div>
                <FontAwesomeIcon icon="bell" />
                {this.state.unreadCount > 0 &&
                <span className="fa-layers-counter">{this.state.unreadCount}</span>
                }
              </div>
            </NavLink>
            <a
              className="navbar-item"
              href={`/assets/files/Transportation_Fuels_Reporting_System_-_${this.props.loggedInUser.isGovernmentUser ? 'IDIR' : 'BCeID'}_Manual.pdf`}
              id="navbar-help"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div>
                <FontAwesomeIcon icon={['far', 'question-circle']} />
              </div>
            </a>
          </div>
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
          <li>
            <NavLink
              activeClassName="active"
              id="navbar-home"
              isActive={(match, location) => {
                if ((match && match.isExact) || (location.pathname.indexOf('/dashboard') === 0)) {
                  return true;
                }

                return false;
              }}
              to={Routes.HOME}
            >
              Home
            </NavLink>
          </li>
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
          <li>
            <NavLink
              activeClassName="active"
              id="collapse-navbar-credit-transactions"
              to={CREDIT_TRANSACTIONS.LIST}
            >
              Credit Transactions
            </NavLink>
          </li>
          {CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED &&
          typeof this.props.loggedInUser.hasPermission === 'function' &&
          this.props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW) &&
          !this.props.loggedInUser.isGovernmentUser &&
          <li>
            <NavLink
              activeClassName="active"
              id="collapse-navbar-secure-document-upload"
              to={SECURE_DOCUMENT_UPLOAD.LIST}
            >
              File Submissions
            </NavLink>
          </li>
          }
          {CONFIG.COMPLIANCE_REPORTING.ENABLED &&
          typeof this.props.loggedInUser.hasPermission === 'function' &&
          this.props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW) &&
          <li>
            <NavLink
              activeClassName="active"
              id="collapse-navbar-compliance-reporting"
              to={COMPLIANCE_REPORTING.LIST}
            >
              Compliance &amp; Exclusion Reports
            </NavLink>
          </li>
          }
          {CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED &&
          typeof this.props.loggedInUser.hasPermission === 'function' &&
          this.props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW) &&
          this.props.loggedInUser.isGovernmentUser &&
          <li>
            <NavLink
              activeClassName="active"
              id="collapse-navbar-secure-document-upload"
              to={SECURE_DOCUMENT_UPLOAD.LIST}
            >
              File Submissions
            </NavLink>
          </li>
          }
          {CONFIG.FUEL_CODES.ENABLED &&
          this.props.loggedInUser.isGovernmentUser &&
          <li>
            <NavLink
              activeClassName="active"
              id="navbar-fuel-codes"
              to={FUEL_CODES.LIST}
            >
              Fuel Codes
            </NavLink>
          </li>
          }
          {!this.props.loggedInUser.isGovernmentUser &&
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
              Organization Details
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
              {this.state.unreadCount > 0 &&
              <span> ({this.state.unreadCount})</span>
              }
            </NavLink>
          </li>
          <li>
            <NavLink id="navbar-settings" to={Routes.SETTINGS}>
              Settings
            </NavLink>
          </li>
          <li>
            <a
              href={`/assets/files/Transportation_Fuels_Reporting_System_-_${this.props.loggedInUser.isGovernmentUser ? 'IDIR' : 'BCeID'}_Manual.pdf`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Help
            </a>
          </li>
          <li>
            <NavLink
              id="navbar-logout"
              onClick={(e) => {
                e.preventDefault();
                this.props.signUserOut();
              }}
              to={Routes.LOGOUT}
            >
              Log Out
            </NavLink>
          </li>
        </ul>
      </div>);

    return (
      <div id="header" role="banner">
        <div id="header-main" className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div id="header-main-row">
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

              <div className="bcgov-title hidden-xs">
                <h1>Transportation Fuels Reporting System</h1>
              </div>

              <div className="pull-right">
                <div>
                  <h5 id="organization-name">
                    {this.props.loggedInUser.organization &&
                      this.props.loggedInUser.organization.name}
                  </h5>
                  {this.props.loggedInUser.roles &&
                  !this.props.loggedInUser.isGovernmentUser &&
                  <span id="organization-balance">
                      Credit Balance: {
                      numeral(this.props.loggedInUser.organization.organizationBalance.validatedCredits)
                        .format(NumberFormat.INT)
                    }
                  </span>
                  }
                </div>
              </div>
              {this.props.isAuthenticated && CollapsedNavigation}
            </div>
          </div>
          <div className="navigationRibbon hidden-xs">
            {this.props.isAuthenticated && SecondLevelNavigation}
          </div>
        </div>
      </div>
    );
  }
}

Navbar.defaultProps = {
  unreadNotificationsCount: null
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      })
    }),
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    }))
  }).isRequired,
  signUserOut: PropTypes.func.isRequired,
  unreadNotificationsCount: PropTypes.number
};

const mapDispatchToProps = dispatch => ({
  signUserOut: bindActionCreators(signUserOut, dispatch)
});

// export default Navbar;
export default connect(state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  isAuthenticated: state.rootReducer.userRequest.isAuthenticated
}), mapDispatchToProps, null, {
  pure: false
})(Navbar);
