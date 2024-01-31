import PropTypes from 'prop-types'
import React from 'react'
import Draggable from 'react-draggable'

import { formatNumeric } from '../../utils/functions'

const ScheduleBTotals = (props) => {
  const formatNumber = (value) => {
    if (value === 0) {
      return '-'
    }

    return formatNumeric(Math.round(value), 0)
  }

  const getNetTotal = () => {
    const { credit, debit } = props.totals
    const value = credit - debit

    if (value === 0) {
      return '-'
    }

    if (value < 0) {
      return `(${formatNumeric(Math.round(value * -1), 0)})`
    }

    return formatNumeric(Math.round(value), 0)
  }

  return (
    <Draggable bounds="parent">
      <div
        className="schedule-totals schedule-b"
        key="totals"
      >
        <div className="row">
          <div className="col-md-12">
            <h2>Totals</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="total-credit">Total Credit</label>
          </div>
          <div className="col-md-6 value">{formatNumber(props.totals.credit)}</div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="total-debit">Total Debit</label>
          </div>
          <div className={`col-md-6 value ${props.totals.debit > 0 ? 'debit' : ''}`}>{props.totals.debit > 0 ? `(${formatNumber(props.totals.debit)})` : '-'}</div>
        </div>

        <div className="row net-total">
          <div className="col-md-6">
            <label htmlFor="net-total">Net Credit or (Debit)</label>
          </div>
          <div className={`col-md-6 value ${props.totals.debit > props.totals.credit ? 'debit' : ''}`}>{getNetTotal()}</div>
        </div>
      </div>
    </Draggable>
  )
}

ScheduleBTotals.propTypes = {
  totals: PropTypes.shape({
    credit: PropTypes.number,
    debit: PropTypes.number
  }).isRequired
}

export default ScheduleBTotals
