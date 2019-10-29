import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class ExclusionReportingStatusHistory extends Component {
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
      return <span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong> </span>;
    }

    if (history.status.managerStatus === 'Not Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Rejection</strong> </span>;
    }

    if (history.status.managerStatus === 'Requested Supplemental') {
      return <strong>Supplemental Requested </strong>;
    }

    if (history.status.analystStatus === 'Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong> </span>;
    }

    if (history.status.analystStatus === 'Not Recommended') {
      return <span><strong>Reviewed</strong> and <strong>Recommended Rejection</strong> </span>;
    }

    if (history.status.analystStatus === 'Requested Supplemental') {
      return <strong>Supplemental Requested </strong>;
    }

    return (<strong>{history.status.fuelSupplierStatus} </strong>);
  }

  constructor (props) {
    super(props);
  }

  render () {
    if (!this.props.complianceReport.history || this.props.complianceReport.history.length === 0) {
      return false;
    }

    const showCurrent = (this.props.complianceReport.history.filter(
      c => (c.complianceReport === this.props.complianceReport.id)
    ).length === 0);

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <ul>
            {showCurrent &&
            <li>
              <a href="#" onClick={() => this.props.onSwitchHandler(-1)}>Current Revision {this.props.complianceReport.displayName}</a>
            </li>
            }
            {this.props.complianceReport.history.length > 0 &&
            this.props.complianceReport.history.map((history, index, arr) => {
              let deltaTarget = history.complianceReport;
              if (this.props.complianceReport.deltas.filter(d => (d.ancestorId === deltaTarget)).length === 0) {
                deltaTarget = '-1';
              }

              const action = ExclusionReportingStatusHistory.renderHistory(history);

              if (['Accepted', 'Rejected'].indexOf(history.status.directorStatus) >= 0) {
                return ExclusionReportingStatusHistory.renderDirectorStatus(history);
              }

              return (
                <li key={history.id}>{action}
                  <a
                    href="#"
                    onClick={() => this.props.onSwitchHandler(deltaTarget)}
                  >
                    {history.displayName}
                  </a>
                  <span> on </span>
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
    );
  }
}

ExclusionReportingStatusHistory.defaultProps = {
  complianceReport: {
    compliancePeriod: {
      description: ''
    },
    history: [],
    organization: {
      name: ''
    }
  },
  reportType: 'Exclusion Report'
};

ExclusionReportingStatusHistory.propTypes = {
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
  }),
  onSwitchHandler: PropTypes.func.isRequired,
  reportType: PropTypes.string
};

export default ExclusionReportingStatusHistory;
