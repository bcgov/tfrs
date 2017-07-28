import React, { Component } from 'react';
import { connect } from 'react-redux';

class SearchBar extends Component {
  handleCheckboxChange() {
  }

  render() {
    return (
      <div className="actions-container">
        <button className="btn btn-primary">Propose Trade</button>
        <label className="checkbox"> 
          <input type="checkbox" onChange={() => this.handleCheckboxChange()} />
          Last 12 months
        </label>
      </div>
    );
  }
}

export default connect(
  state => ({
  }),
  dispatch => ({
  }),
)(SearchBar);