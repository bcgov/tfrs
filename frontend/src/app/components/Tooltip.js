import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip as ReactTooltip } from 'react-bootstrap'

class Tooltip extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hovering: 0
    }

    this._hover = this._hover.bind(this)
    this._hoverOut = this._hoverOut.bind(this)
  }

  _hover () {
    this.setState({
      hovering: 3000
    })
  }

  _hoverOut () {
    this.setState({
      hovering: 0
    })
  }

  _renderOverlay () {
    return (
      <OverlayTrigger
        delayHide={this.state.hovering}
        placement={this.props.placement}
        onBlur={this._hoverOut}
        onMouseLeave={this._hoverOut}
        onMouseOut={this._hoverOut}
        overlay={this._tooltip()}
        rootClose
      >
        <div className="overlay-trigger">
          {this.props.children}
        </div>
      </OverlayTrigger>
    )
  }

  _tooltip () {
    return (
      <ReactTooltip
        className={this.props.className}
        id="tooltip"
        onBlur={this._hoverOut}
        onMouseLeave={this._hoverOut}
        onMouseOver={this._hover}
        onFocus={this._hover}
      >
      <div className="tooltip-content"> 
        {Array.isArray(this.props.title) &&
          this.props.title.map(title => (
            <div key={title}>
              <ReactMarkdown>{title}</ReactMarkdown>
            </div>
          ))}
        {!Array.isArray(this.props.title) && (
          <ReactMarkdown>{this.props.title}</ReactMarkdown>
        )}
      </div>
      </ReactTooltip>
    )
  }

  render () {
    if (this.props.show) {
      return this._renderOverlay()
    }

    return this.props.children
  }
}

Tooltip.defaultProps = {
  className: 'danger',
  placement: 'top',
  show: false
}

Tooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  placement: PropTypes.string,
  show: PropTypes.bool,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
}

export default Tooltip
