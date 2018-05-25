import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getSigningAuthorityAssertions from '../../actions/signingAuthorityAssertionsActions';
import CheckBox from '../../app/components/CheckBox';

class CreditTransferTerms extends Component {
  componentWillMount () {
    this.props.getSigningAuthorityAssertions();
  }

  render () {
    let content = [(
      <h3 className="terms-header" key="header">Signing Authority Declaration</h3>
    )];

    content = content.concat(this.props.signingAuthorityAssertions.map(assertion => (
      <div className="terms" key={assertion.id}>
        <div className="check">
          <CheckBox
            addToFields={this.props.addToFields}
            fields={this.props.fields.terms}
            id={assertion.id}
            toggleCheck={this.props.toggleCheck}
          />
        </div>
        <div>{assertion.description}</div>
      </div>
    )));

    return content;
  }
}

CreditTransferTerms.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    terms: PropTypes.array
  }).isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
  signingAuthorityAssertions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.signingAuthorityAssertions.isFetching,
  signingAuthorityAssertions: state.rootReducer.signingAuthorityAssertions.items
});

const mapDispatchToProps = dispatch => ({
  getSigningAuthorityAssertions: bindActionCreators(getSigningAuthorityAssertions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferTerms);
