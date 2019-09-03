import React, { Component } from 'react';
import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

class ComplianceReportingStatusHistory extends Component {
  static renderDirectorStatus (history) {
    let action = <strong>Accepted</strong>;

    if (history.status.directorStatus === 'Rejected') {
      action = <strong>Rejected</strong>;
    }

    let roleDisplay = null;

    if (history.userRole) {
      roleDisplay = history.userRole.description;

      if (history.userRole.name === 'GovDeputyDirector' ||
          history.userRole.name === 'GovDirector') {
        roleDisplay = roleDisplay.replace('Government ', '');
      }
    }

    return (
      <li key={history.id}>
        {action} <span> on </span>
        {moment(history.createTimestamp).format('LL')}
        <span> by </span>
        <strong> {history.user.firstName} {history.user.lastName}</strong>
        {roleDisplay &&
          <span>
            <strong>, {roleDisplay} </strong> under the
          </span>
        }
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act</em>
      </li>
    );
  }

  static renderHistory (history) {
    // please do not combine this with the bottom check
    // they output the same, but the order of condition is important
    if (history.status.managerStatus === 'Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong></span>;
    }

    if (history.status.managerStatus === 'Not Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Rejection</strong></span>;
    }

    if (history.status.analystStatus === 'Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong></span>;
    }

    if (history.status.analystStatus === 'Not Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Rejection</strong></span>;
    }

    return (<strong>{history.status.fuelSupplierStatus} </strong>);
  }

  constructor (props) {
    super(props);

    this.state = {
      collapsed: true
    };

    this._toggleStatusHistory = this._toggleStatusHistory.bind(this);
  }

  _toggleStatusHistory () {
    const collapsed = !this.state.collapsed;

    this.setState({
      collapsed
    });
  }

  render () {
    if (!this.props.complianceReport.history || this.props.complianceReport.history.length === 0) {
      return false;
    }

    return (
      <div className="panel panel-default">
        <div
          className="panel-heading"
          id="transaction-history-header"
          role="tab"
        >
          <h4 className="panel-title">
            <button
              aria-controls="collapse-messages"
              aria-expanded="true"
              className="text"
              onClick={this._toggleStatusHistory}
              type="button"
            >
              <FontAwesomeIcon icon="history" /> Compliance Report for
              {` ${typeof this.props.complianceReport.compliancePeriod === 'string'
                ? this.props.complianceReport.compliancePeriod
                : this.props.complianceReport.compliancePeriod.description
              }, `}
              {` ${this.props.complianceReport.organization.name} `}
              &mdash; Report Status &amp; History
            </button>
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              className="toggle"
              onClick={this._toggleStatusHistory}
              type="button"
            >
              {<FontAwesomeIcon icon={this.state.collapsed ? 'angle-down' : 'angle-up'} />}
            </button>
          </h4>
        </div>

        <Collapse in={!this.state.collapsed}>
          <div
            id="collapse-messages"
          >
            <div className="panel-body">
              <ul>
                {this.props.complianceReport.history.length > 0 &&
                  this.props.complianceReport.history.map((history, index, arr) => {
                    const action = ComplianceReportingStatusHistory.renderHistory(history);

                    if (['Accepted', 'Rejected'].indexOf(history.status.directorStatus) >= 0) {
                      return ComplianceReportingStatusHistory.renderDirectorStatus(history);
                    }

                    return (
                      <li key={history.id}>
                        {action} <span> on </span>
                        {moment(history.createTimestamp).format('LL')}
                        <span> by </span>
                        <strong> {history.user.firstName} {history.user.lastName}</strong> of
                        <strong> {history.user.organization.name} </strong>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

ComplianceReportingStatusHistory.defaultProps = {
  complianceReport: {
    compliancePeriod: {
      description: ''
    },
    history: [],
    organization: {
      name: ''
    }
  }
};

ComplianceReportingStatusHistory.propTypes = {
  complianceReport: PropTypes.shape({
    compliancePeriod: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        description: PropTypes.string
      })
    ]),
    history: PropTypes.arrayOf(PropTypes.shape({
      creditTradeUpdateTime: PropTypes.string,
      isRescinded: PropTypes.bool,
      status: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string
      }),
      user: PropTypes.shape({
        displayName: PropTypes.string,
        firstName: PropTypes.string,
        id: PropTypes.number,
        lastName: PropTypes.string
      })
    })),
    organization: PropTypes.shape({
      name: PropTypes.string
    })
  })
};

export default ComplianceReportingStatusHistory;
