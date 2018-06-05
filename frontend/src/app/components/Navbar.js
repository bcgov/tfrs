import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as Routes from '../../constants/routes';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import HISTORICAL_DATA_ENTRY from '../../constants/routes/HistoricalDataEntry';
import ORGANIZATIONS from '../../constants/routes/Organizations';

class Navbar extends Component {
  static updateContainerPadding () {
    const headerHeight = document.getElementById('header-main').clientHeight;
    const topSpacing = 30;
    const totalSpacing = headerHeight + topSpacing;
    document.getElementById('main').setAttribute('style', `padding-top: ${totalSpacing}px;`);
  }

  componentDidMount () {
    Navbar.updateContainerPadding();
    window.addEventListener('resize', () => Navbar.updateContainerPadding());
  }

  componentDidUpdate () {
    Navbar.updateContainerPadding();
  }

  render () {
    const SecondLevelNavigation = (
      <div className="level2Navigation">
        <div className="container">
          {this.props.loggedInUser.role &&
          this.props.loggedInUser.role.isGovernmentRole &&
          <Link id="navbar-organizations" to={ORGANIZATIONS.LIST}>
            Fuel Suppliers
          </Link>
          }
          {this.props.loggedInUser.role &&
          !this.props.loggedInUser.role.isGovernmentRole &&
          <a
            href={ORGANIZATIONS.BULLETIN}
            rel="noopener noreferrer"
            target="_blank"
          >
            Fuel Suppliers
          </a>
          }
          <Link id="navbar-credit-transactions" to={CREDIT_TRANSACTIONS.LIST}>
            Credit Transactions
          </Link>
          {this.props.loggedInUser.role &&
          this.props.loggedInUser.role.isGovernmentRole &&
          <Link id="navbar-administration" to={HISTORICAL_DATA_ENTRY.LIST}>
            Administration
          </Link>
          }
          <Link id="navbar-logout" to={Routes.LOGOUT}>
            Log-out
          </Link>
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
          {this.props.loggedInUser.role &&
          this.props.loggedInUser.role.isGovernmentRole &&
          <li>
            <Link
              id="collapse-navbar-organization"
              to={ORGANIZATIONS.LIST}
            >
              Fuel Suppliers
            </Link>
          </li>
          }
          {this.props.loggedInUser.role &&
          !this.props.loggedInUser.role.isGovernmentRole &&
          <li>
            <a
              href={ORGANIZATIONS.BULLETIN}
              rel="noopener noreferrer"
              target="_blank"
            >
              Fuel Suppliers
            </a>
          </li>
          }
          <li>
            <Link
              id="collapse-navbar-credit-transactions"
              to={CREDIT_TRANSACTIONS.LIST}
            >
            Credit Transactions
            </Link>
          </li>
          {this.props.loggedInUser.role &&
          this.props.loggedInUser.role.isGovernmentRole &&
          <li>
            <Link
              id="collapse-navbar-administration"
              to={HISTORICAL_DATA_ENTRY.LIST}
            >
              Administration
            </Link>
          </li>
          }
        </ul>
      </div>);

    return (
      <div id="header" role="banner">
        <div id="header-main" className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div id="header-main-row" className="row">
              <div className="col-sm-3 col-md-2 col-lg-2 header-main-left">
                <div id="logo">
                  <a id="gov-logo" href="http://gov.bc.ca">
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
              <div className="col-sm-6 col-md-6 col-lg-6 hidden-xs">
                <div className="bcgov-title">
                  <h1>Transportation Fuels Reporting System</h1>
                </div>
              </div>
              <div className="col-sm-4 col-md-4 col-lg-4 hidden-xs">
                <div className="pull-right">
                  <h5 id="display_name">{this.props.loggedInUser.displayName}</h5>
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

Navbar.propTypes = {
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    role: PropTypes.shape({
      id: PropTypes.number,
      isGovernmentRole: PropTypes.bool
    })
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

// export default Navbar;
export default connect(state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  isAuthenticated: state.rootReducer.userRequest.isAuthenticated
}))(Navbar);
