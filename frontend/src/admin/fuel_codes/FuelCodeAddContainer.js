/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class FuelCodeAddContainer extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <FuelCodeForm
        addToFields={this._addToFields}
        fields={this.state.fields}
        title="New Fuel Code"
        errors={this.props.error}
      />
    );
  }
}

FuelCodeAddContainer.defaultProps = {
};

FuelCodeAddContainer.propTypes = {
  error: PropTypes.shape({})
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodeAddContainer);
