import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getSigningAuthorityAssertions from '../../actions/signingAuthorityAssertionsActions';
import CheckBox from '../../app/components/CheckBox';

class CreditTransferTerms extends Component {
  constructor (props) {
    super(props);

    this._addTerms = this._addTerms.bind(this);
  }

  componentWillMount () {
    this.props.getSigningAuthorityAssertions();
    this._addTerms();
  }

  _addTerms () {
    const terms = {};
    this.props.signingAuthorityAssertions.forEach((assertion) => {
      terms[assertion.id] = false;
    });

    this.props.addTerms(terms);
  }

  render () {
    return this.props.signingAuthorityAssertions.map(assertion => (
      <div className="terms" key={assertion.id}>
        <div className="check">
          <CheckBox
            field={this.props.terms[assertion.id]}
            id={assertion.id}
            toggleCheck={this.props.toggleCheck}
          />
        </div>
        <div>{assertion.description}</div>
      </div>
    ));
  }
}

CreditTransferTerms.propTypes = {
  addTerms: PropTypes.func.isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
  signingAuthorityAssertions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  terms: PropTypes.shape({}).isRequired,
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
