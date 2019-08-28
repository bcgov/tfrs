import React, { Component } from 'react';
import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

class ComplianceReportingStatusHistory extends Component {
  static renderHistory (history) {
    if (history.status.managerStatus === 'Recommended' || history.status.analystStatus === 'Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong></span>;
    }

    if (history.status.managerStatus === 'Not Recommended' || history.status.analystStatus === 'Not Recommended') {
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
              onClick={this._toggleStatusHistory}
              type="button"
            >
              <FontAwesomeIcon icon="history" /> Compliance Report for
              {` ${this.props.complianceReport.compliancePeriod.description}, `}
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
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string
    }),
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
