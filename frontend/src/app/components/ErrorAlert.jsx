import React, {Component} from 'react';

export default class ErrorAlert extends Component {
  render () {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>{this.props.message}</p>
      </div>
    );
  }
}
