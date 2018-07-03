import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LocalTimestamp extends Component {
  constructor (props) {
    super(props);

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    };

    this.formatter = new Intl.DateTimeFormat('en-CA', options);
  }

  render () {
    const ts = Date.parse(this.props.iso8601Date);
    return <span>{this.formatter.format(ts)}</span>;
  }
}

LocalTimestamp.defaultProps = {
};

LocalTimestamp.propTypes = {
  iso8601Date: PropTypes.string.isRequired
};

export default LocalTimestamp;
