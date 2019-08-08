import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class ComplianceReportingStatusHistory extends Component {
  static renderHistory (history) {
    return (<strong>{history.status.status} </strong>);
  }

  render () {
    if (!this.props.history || this.props.history.length === 0) {
      return false;
    }

    return (
      <div className="credit-transfer-signing-history">
        <h3 className="signing-authority-header" key="header">Report History</h3>
        {this.props.history.length > 0 &&
        this.props.history.map((history, index, arr) => {
          let action;

          switch (history.status.description) {
            default:
              action = ComplianceReportingStatusHistory.renderHistory(history);
          }

          return (
            <p key={history.id}>{action} <span> on </span>
              {moment(history.createTimestamp).format('LL')}
              <span> by </span>
              <strong> {history.user.firstName} {history.user.lastName}</strong> of
              <strong> {history.user.organization.name} </strong>
            </p>
          );
        })}
      </div>
    );
  }
}

ComplianceReportingStatusHistory.defaultProps = {
  history: []
};

ComplianceReportingStatusHistory.propTypes = {
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
  }))
};

export default ComplianceReportingStatusHistory;
