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
  >
    <h5><b>Credit Transfer Proposal Summary</b></h5>
    <p>
      Credits From: {props.item.creditsFrom.name} <br />
      Credits To: {props.item.creditsTo.name} <br />
      Quantity of credits to be transferred: {
        numeral(props.item.numberOfCredits).format(NumberFormat.INT)} <br />
      Value per credit: {numeral(props.item.fairMarketValuePerCredit).format(NumberFormat.CURRENCY)}
    </p>
    <p>
      Are you sure you want to sign and send this Credit Transfer Proposal
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
