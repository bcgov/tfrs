import PropTypes from 'prop-types'
import React from 'react'
import CheckBox from '../../app/components/CheckBox'

const CreditTransferTerms = props => {
  return (
    <div className="credit-transfer-terms">

      <h3 className="terms-header">Signing Authority Declaration
      </h3>

      {!props.signingAuthorityAssertions.isFetching &&
      props.signingAuthorityAssertions.items.map(assertion => (
        <div className="terms" key={assertion.id}>
          <div id="credit-transfer-term" className="check">
            <CheckBox
              addToFields={props.addToFields}
              fields={props.fields.terms}
              id={assertion.id}
              toggleCheck={props.toggleCheck}
            />
          </div>
          <div>{assertion.description}</div>
        </div>
      ))}
    </div>
  )
}

CreditTransferTerms.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    terms: PropTypes.array
  }).isRequired,
  signingAuthorityAssertions: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
}

export default CreditTransferTerms
