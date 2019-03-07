import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class TooltipWhenDisabled extends Component {
  _renderDisabled () {
    return (
      <OverlayTrigger placement="top" overlay={this._tooltip()}>
        <div className="overlay-trigger">
          {this.props.children}
        </div>
      </OverlayTrigger>
    );
  }

  _tooltip () {
    return (
      <Tooltip className="danger" id="tooltip">
        {Array.isArray(this.props.title) &&
          this.props.title.map(title => (<div key={title}>{title}</div>))
        }
        {!Array.isArray(this.props.title) &&
          this.props.title
        }
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
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default TooltipWhenDisabled;
