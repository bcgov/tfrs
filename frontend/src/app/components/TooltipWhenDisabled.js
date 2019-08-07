import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
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
      <Tooltip className={this.props.className} id="tooltip">
        {Array.isArray(this.props.title) &&
          this.props.title.map(title => (<div key={title}><ReactMarkdown source={title} /></div>))
        }
        {!Array.isArray(this.props.title) &&
          <ReactMarkdown source={this.props.title} />
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
  className: 'danger',
  disabled: true
};

TooltipWhenDisabled.propTypes = {
  className: PropTypes.string,
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
