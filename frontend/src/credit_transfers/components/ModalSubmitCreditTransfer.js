import numeral from 'numeral'
import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../app/components/Modal'
import * as NumberFormat from '../../constants/numeralFormats'

const ModalSubmitCreditTransfer = props => (
  <Modal
    handleSubmit={props.handleSubmit}
    id="confirmSubmit"
    key="confirmSubmit"
    confirmLabel="Sign and send"
    cancelLabel="Cancel"
  >
    <h5><b>Transfer Summary</b></h5>
    <p>
      Compliance units from: {props.item.creditsFrom.name} <br />
      Compliance units to: {props.item.creditsTo.name} <br />
      Number of units to be transferred: {
        numeral(props.item.numberOfCredits).format(NumberFormat.INT)} <br />
      Value per unit: {numeral(props.item.fairMarketValuePerCredit).format(NumberFormat.CURRENCY)}
    </p>
    <p>
      Are you sure you want to sign and send this transfer
      to {props.item.creditsTo.name}?
    </p>
  </Modal>
)

ModalSubmitCreditTransfer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
    creditsFrom: PropTypes.shape({
      name: PropTypes.string
    }),
    creditsTo: PropTypes.shape({
      name: PropTypes.string
    }),
    fairMarketValuePerCredit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    numberOfCredits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }).isRequired
}

export default ModalSubmitCreditTransfer
