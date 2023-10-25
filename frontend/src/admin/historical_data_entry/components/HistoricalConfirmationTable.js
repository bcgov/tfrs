import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import ReactDataSheet from 'react-datasheet'
import Loading from '../../../app/components/Loading'

import { getOrganizationBalance } from '../../../actions/organizationActions'

const HistoricalConfirmationTable = props => {
  const { item, organizationBalance, getOrganizationBalance } = props
  const [availableBalance, setAvailableBalance] = useState(0)

  useEffect(() => {
    // Check if organization balance is fetching
    if (!organizationBalance.isFetching) {
      getOrganizationBalance(item.creditsTo.id)
    }
  }, [item.creditsTo.id])

  // Check if organization balance is still fetching, if so, display a loading indicator
  if (organizationBalance.isFetching) {
    return <Loading />
  }
  if (organizationBalance.details &&
     organizationBalance.details.availableBalance !== availableBalance &&
     item.creditsTo.id === organizationBalance.details.organization) {
    setAvailableBalance(organizationBalance.details.availableBalance)
  }

  function decimalViewer (digits = 2) {
    return cell => Number(cell.value).toFixed(digits)
      .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  function buildGrid (item) {
    const credits = item.numberOfCredits
    const offset = availableBalance + credits

    const nonCompliancePenalty = (credits < 0 && offset < 0) ? offset * -600 : 0
    const balanceChange = (offset < 0) ? (availableBalance * -1) : credits
    const balanceAfterTransaction = availableBalance + balanceChange

    const grid = [
      [{
        className: 'text',
        readOnly: true,
        value: 'Transaction'
      }, {
        className: 'number',
        readOnly: true,
        valueViewer: decimalViewer(0),
        value: credits // credits
      }], [{
        className: 'text',
        readOnly: true,
        value: 'Current compliance unit balance'
      }, {
        className: 'number',
        readOnly: true,
        valueViewer: decimalViewer(0),
        value: availableBalance // balance
      }], [{
        className: 'text',
        readOnly: true,
        value: 'Compliance unit balance change from this transaction'
      }, {
        className: 'number',
        readOnly: true,
        valueViewer: decimalViewer(0),
        value: balanceChange // balance change from this transaction
      }], [{
        className: 'text',
        readOnly: true,
        value: 'Compliance unit balance after this transaction is committed'
      }, {
        className: 'number',
        readOnly: true,
        valueViewer: decimalViewer(0),
        value: balanceAfterTransaction // balance after transaction
      }], [{
        className: 'text',
        readOnly: true,
        value: `Non-compliance penalty payable, if applicable (${offset * -1} * $600 CAD per unit)`
      }, {
        className: 'number',
        readOnly: true,
        valueViewer: decimalViewer(0),
        value: nonCompliancePenalty // balance after transaction
      }]
    ]
    if (nonCompliancePenalty <= 0) {
      grid[4][0].className = 'hidden'
      grid[4][1].className = 'hidden'
    }
    return grid
  }

  return (
    <>
      <p><b>{item.creditsTo.name}</b> compliance unit balance will change as follows:</p>
      <ReactDataSheet
        className="spreadsheet"
        data={buildGrid(item)}
        valueRenderer={cell => cell.value}
      />
    </>
  )
}

HistoricalConfirmationTable.propTypes = {
  item: PropTypes.object.isRequired,
  getOrganizationBalance: PropTypes.func.isRequired,
  organizationBalance: PropTypes.shape({
    details: PropTypes.object,
    isFetching: PropTypes.bool
  }).isRequired
}

const mapStateToProps = state => ({
  organizationBalance: {
    details: state.rootReducer.organizationBalanceRequest.details,
    isFetching: state.rootReducer.organizationBalanceRequest.isFetching
  }
})

const mapDispatchToProps = dispatch => ({
  getOrganizationBalance: bindActionCreators(getOrganizationBalance, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalConfirmationTable)
