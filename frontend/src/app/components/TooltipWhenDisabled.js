import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class TooltipWhenDisabled extends Component {
  _renderDisabled () {
    return (
      <OverlayTrigger placement="right" overlay={this._tooltip()}>
        <div className="overlay-trigger">
          {this.props.children}
        </div>
      </OverlayTrigger>
    );
  }

  _tooltip () {
    return (
      <Tooltip id="tooltip">
        {this.props.title}
      </Tooltip>
    );
  }

  render () {
    if (this.props.disabled) {
      return this._renderDisabled();
    }

    return this.props.children;
  }
}

TooltipWhenDisabled.defaultProps = {
  disabled: true
};

TooltipWhenDisabled.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired
};

export default TooltipWhenDisabled;
