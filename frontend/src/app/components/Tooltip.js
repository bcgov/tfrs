import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip as ReactTooltip } from 'react-bootstrap';

class Tooltip extends Component {
  _renderOverlay () {
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
      <ReactTooltip className={this.props.className} id="tooltip">
        {Array.isArray(this.props.title) &&
          this.props.title.map(title => (<div key={title}><ReactMarkdown source={title} /></div>))
        }
        {!Array.isArray(this.props.title) &&
          <ReactMarkdown source={this.props.title} />
        }
      </ReactTooltip>
    );
  }

  render () {
    if (this.props.show) {
      return this._renderOverlay();
    }

    return this.props.children;
  }
}

Tooltip.defaultProps = {
  className: 'danger',
  show: true
};

Tooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  show: PropTypes.bool,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default Tooltip;
