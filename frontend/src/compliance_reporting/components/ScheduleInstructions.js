import React, { Component } from 'react';
import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class ScheduleInstructions extends Component {
  constructor (props) {
    super(props);

    this.state = {
      collapsed: true
    };

    this._toggleInstructions = this._toggleInstructions.bind(this);
  }

  _toggleInstructions () {
    const collapsed = !this.state.collapsed;

    this.setState({
      collapsed
    });
  }

  render () {
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
              onClick={this._toggleInstructions}
              type="button"
            >
              <FontAwesomeIcon icon={['far', 'question-circle']} />
              {this.props.scheduleType === 'schedule-b' &&
              ` Schedule B Instructions`
              }
              {this.props.scheduleType === 'schedule-d' &&
              ` Schedule D Instructions`
              }
            </button>
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              className="toggle"
              onClick={this._toggleInstructions}
              type="button"
            >
              <FontAwesomeIcon icon={this.state.collapsed ? 'angle-down' : 'angle-up'} />
            </button>
          </h4>
        </div>

        <Collapse in={!this.state.collapsed}>
          <div id="collapse-messages">
            <div className="panel-body schedule-instructions">
              {this.props.scheduleType === 'schedule-b' &&
                `Report the fuel volumes supplied for transportation. Do not include fuel volumes
                supplied for purposes other than transportation in Schedule B; please report those
                fuel quantities in Schedule C.`
              }
              {this.props.scheduleType === 'schedule-d' && [
                <p key="schedule-d-instructions-1">
                  A GHGenius Input and Output Summary Table must be completed for each separate
                  fuel being reported with a carbon intensity determined using GHGenius under
                  section 6 (5) (d) (ii) (A) and reported in Schedule B.
                </p>,
                <p key="schedule-d-instructions-2">
                  <strong>
                    Schedule D should be completed before reporting the fuel in Schedule B, as
                    the values entered in this schedule inform the carbon intensity reported in
                    Schedule B.
                  </strong>
                </p>,
                <p key="schedule-d-instructions-3">
                  The approved version of GHGenius must be used as defined in section 11.06 (1)
                  of the Renewable and Low Carbon Fuel Requirements Regulation and specified in
                  <em> Information Bulletin RLCF-011 - Approved Version of GHGenius</em>,
                  {` available from `}
                  <a href="https://www.gov.bc.ca/lowcarbonfuels" rel="noopener noreferrer" target="_blank">
                  www.gov.bc.ca/lowcarbonfuels
                  </a>.
                </p>,
                <p key="schedule-d-instructions-4">
                  The Input Summary Table must include all input data required to reproduce the
                  requested carbon intensity using the approved version of GHGenius.
                </p>,
                <p key="schedule-d-instructions-5">
                  The Output Summary Table must contain the emissions associated with all twelve
                  of the lifecycle components listed in the Output Summary Table within this
                  schedule in accordance with section 11.05 (3) of the Renewable and Low Carbon
                  Fuel Requirements Regulation. Input the emissions associated with each component
                  from the GHGenius model into the appropriate row in the Output Summary Table.
                </p>,
                <p key="schedule-d-instructions-6">
                  {`It is recommended that users consult `}
                  <em>
                    Information Bulletin RLCF-010 - Using GHGenius in B.C.
                  </em>
                  {`, available from `}
                  <a href="https://www.gov.bc.ca/lowcarbonfuels" rel="noopener noreferrer" target="_blank">
                  www.gov.bc.ca/lowcarbonfuels
                  </a>, before attempting to use GHGenius.
                </p>
              ]}
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

ScheduleInstructions.defaultProps = {
  children: null
};

ScheduleInstructions.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  scheduleType: PropTypes.oneOf([
    'schedule-a', 'schedule-b', 'schedule-c', 'schedule-d'
  ]).isRequired
};

export default ScheduleInstructions;
