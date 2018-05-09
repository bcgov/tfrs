import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from '../../app/components/CheckBox';

const CreditTransferTerms = props => ([
  <div className="terms" key="regulation">
    <div className="check">
      <CheckBox
        field={props.terms.regulation}
        name="regulation"
        toggleCheck={props.toggleCheck}
      />
    </div>
    <div>
      I confirm that records evidencing each matter reported under section 11.11 (2) of the
      Regulation are available on request.
    </div>
  </div>,

  <div className="terms" key="authorized">
    <div className="check">
      <CheckBox
        field={props.terms.authorized}
        name="authorized"
        toggleCheck={props.toggleCheck}
      />
    </div>
    <div>
      I confirm that I am an officer or employee of the fuel supplier, and that records
      evidencing my authority to submit this proposal are available on request.
    </div>
  </div>,

  <div className="terms" key="authorized">
    <div className="check">
      <CheckBox
        field={props.terms.accurate}
        name="accurate"
        toggleCheck={props.toggleCheck}
      />
    </div>
    <div>
      I certify that the information in this report is true and complete to the best of
      my knowledge and I understand that the Director may require records evidencing the
      truth of that information.
    </div>
  </div>
]);

CreditTransferTerms.propTypes = {
  terms: PropTypes.shape({
    accurate: PropTypes.bool,
    authorized: PropTypes.bool,
    regulation: PropTypes.bool
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default CreditTransferTerms;
