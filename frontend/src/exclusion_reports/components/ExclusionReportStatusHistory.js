import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class ExclusionReportingStatusHistory extends Component {

  static actionFor(h) {
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

    return (<span>
      {action}
      <span> on </span>
      {moment(h.createTimestamp).format('LL')}
      <span> by </span>
      <strong>{h.user.firstName} {h.user.lastName}</strong>
      <span> of </span>
      <strong>{h.user.organization.name}</strong>
      {roleDisplay &&
      <span>
          <strong>, {roleDisplay} </strong>
          <span>under the</span>
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act</em>
      </span>
      }
    </span>);
  }

  render() {
    if (!this.props.complianceReport.history || this.props.complianceReport.history.length === 0) {
      return false;
    }

    const showCurrent = (this.props.complianceReport.history.filter(
      c => (c.complianceReport === this.props.complianceReport.id)
    ).length === 0);

    const distinctReports = this.props.complianceReport.history.reduce(
      (m, value) => {
        if (!m.some(v => {
          return v.displayName === value.displayName
        })) {
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

    return (
      <div className={'panel-group'}>
        {showCurrent &&
        <div className="panel panel-default report-history-panel">
          <div className="panel-body" onClick={() => this.props.onSwitchHandler(-1)}>
            <span className={'title'}>{this.props.complianceReport.displayName}</span><br/>
            <strong>Current Version</strong>
          </div>
        </div>
        }
        {distinctReports.length > 0 &&
        distinctReports.map(r => {
          return (<div className="panel panel-default report-history-panel"
                       key={r.displayName}
                       onClick={() => this.props.onSwitchHandler(r.id)}>
              <div className="panel-body">
                <span className={'title'}>{r.displayName}</span>
                <ul>
                  {r.history.map(h => {
                    return (

                      <li key={h.id}>
                        {ExclusionReportingStatusHistory.actionFor(h)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );

        })
        }

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
