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
              <FontAwesomeIcon icon={['far', 'question-circle']} /> Schedule B Instructions
            </button>
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              className="toggle"
              onClick={this._toggleInstructions}
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
              {this.props.children}
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
  ])
};

export default ScheduleInstructions;
