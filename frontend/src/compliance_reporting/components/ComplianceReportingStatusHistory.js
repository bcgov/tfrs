import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

class ComplianceReportingStatusHistory extends Component {
  static actionFor (h) {
    let action = (<strong>{h.status.fuelSupplierStatus}</strong>);
    let roleDisplay = null;

    if (h.status.directorStatus === 'Accepted') {
      action = (<strong>Accepted</strong>);

      if (h.userRole) {
        roleDisplay = h.userRole.description;

        if (h.userRole.name === 'GovDeputyDirector' ||
          h.userRole.name === 'GovDirector') {
          roleDisplay = roleDisplay.replace('Government ', '');
        }
      }
    } else if (h.status.directorStatus === 'Rejected') {
      action = (<strong>Rejected</strong>);

      if (h.userRole) {
        roleDisplay = h.userRole.description;

        if (h.userRole.name === 'GovDeputyDirector' ||
          h.userRole.name === 'GovDirector') {
          roleDisplay = roleDisplay.replace('Government ', '');
        }
      }
    } else if (h.status.managerStatus === 'Recommended') {
      action = (<span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong> </span>);
    } else if (h.status.managerStatus === 'Not Recommended') {
      action = (<span><strong>Reviewed</strong> and <strong>Recommended Rejection</strong> </span>);
    } else if (h.status.managerStatus === 'Requested Supplemental') {
      action = (<strong>Supplemental Requested </strong>);
    } else if (h.status.analystStatus === 'Recommended') {
      action = (<span><strong>Reviewed</strong> and <strong>Recommended Acceptance</strong> </span>);
    } else if (h.status.analystStatus === 'Not Recommended') {
      action = (<span><strong>Reviewed</strong> and <strong>Recommended Rejection</strong> </span>);
    } else if (h.status.analystStatus === 'Requested Supplemental') {
      action = (<strong>Supplemental Requested </strong>);
    }

    return (
      <span>
        {action}
        <span> on </span>
        {moment(h.createTimestamp).tz('America/Vancouver').format('YYYY-MM-DD h:mm a z')}
        <span> by </span>
        <strong>{h.user.firstName} {h.user.lastName}</strong>
        {(!roleDisplay || roleDisplay.indexOf('Director') < 0) &&
          <span>
            <span> of </span>
            <strong>{h.user.organization.name}</strong>
          </span>
        }
        {roleDisplay &&
        <span>
          <strong>, {roleDisplay} </strong>
          <span>under the</span>
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act</em>
        </span>
        }
      </span>
    );
  }

  render () {
    if (!this.props.complianceReport.history || this.props.complianceReport.history.length === 0) {
      return false;
    }
    const currentId = this.props.complianceReport.id;

    const showCurrent = (this.props.complianceReport.history.filter(c =>
      (c.complianceReport === this.props.complianceReport.id)).length === 0);

    const { deltas } = this.props.complianceReport;

    const distinctReports = this.props.complianceReport.history.reduce(
      (m, value) => {
        if (!m.some(v => (v.displayName === value.displayName))) {
          m.push({
            displayName: value.displayName,
            id: value.complianceReport,
            history: []
          });
        }
        m.find(v => v.displayName === value.displayName).history.push(value);
        return m;
      },
      []
    );

    let mainReport;

    return (
      <div className="panel-group">
        {showCurrent &&
        <div className="panel panel-default report-history-panel">
          <div className="panel-body" onClick={() => this.props.onSwitchHandler(-1, 'snapshot')}>
            <span className="title">{this.props.complianceReport.displayName}</span><br />
            <strong>Draft</strong>
          </div>
        </div>
        }
        {distinctReports.length > 0 &&
        distinctReports.map((r) => {
          const currentDelta = deltas ? deltas.find(f =>
            f.ancestorDisplayName === r.displayName) : null;
          let deltaPanel = null;

          if (currentDelta && !this.props.hideChangelogs) {
            deltaPanel = (
              <div
                className="panel panel-default report-history-panel indented"
                key={`delta-${r.id}`}
                onClick={() => this.props.onSwitchHandler(r.id === currentId ? -1 : r.id, 'delta')}
              >
                <div className="panel-body">
                  <span className="title">
                    {`Changelog for ${mainReport && mainReport.displayName}`}
                  </span>
                  <ul>
                    <li>
                      {`${currentDelta.delta.length > 0 ? 'records changed' : 'no changes recorded'}`}
                    </li>
                  </ul>
                </div>
              </div>
            );
          }

          mainReport = r;

          return ([
            deltaPanel,
            <div
              className="panel panel-default report-history-panel"
              key={r.displayName}
              onClick={() => this.props.onSwitchHandler(r.id === currentId ? -1 : r.id, 'snapshot')}
            >
              <div className="panel-body">
                <span className="title">{r.displayName}</span>
                <ul>
                  {r.history.map(h => (
                    <li key={h.id}>
                      {ComplianceReportingStatusHistory.actionFor(h)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>]
          );
        })
        }
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
  },
  onSwitchHandler: () => {
  },
  reportType: 'Compliance Report',
  hideChangelogs: false
};

ComplianceReportingStatusHistory.propTypes = {
  complianceReport: PropTypes.shape({
    compliancePeriod: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        description: PropTypes.string
      })
    ]),
    displayName: PropTypes.string,
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
    id: PropTypes.number,
    organization: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  onSwitchHandler: PropTypes.func,
  reportType: PropTypes.string,
  hideChangelogs: PropTypes.bool
};

export default ComplianceReportingStatusHistory;
