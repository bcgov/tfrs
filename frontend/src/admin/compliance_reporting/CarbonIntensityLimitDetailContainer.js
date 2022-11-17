/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tab, Tabs } from 'react-bootstrap'

import { carbonIntensities } from '../../actions/carbonIntensities'
import Loading from '../../app/components/Loading'
import CarbonIntensityLimitDetails from './components/CarbonIntensityLimitDetails'
import PastAndFutureValuesTable from './components/PastAndFutureValuesTable'
import { useParams } from 'react-router'

const CarbonIntensityLimitDetailContainer = props => {
  const { id } = useParams()

  useEffect(() => {
    props.getCarbonIntensityLimit(id)
  }, [id])

  const { item, isFetching, success } = props.carbonIntensityLimit

  if (success && !isFetching && item) {
    return (
      <Tabs defaultActiveKey="details" id="citabs">
        <Tab eventKey="details" title="Current">
          <CarbonIntensityLimitDetails
            item={item}
            loggedInUser={props.loggedInUser}
            title="Carbon Intensity Limit Details"
          />
        </Tab>
        <Tab eventKey="allValues" title="Past And Future">
          <h1>Past and Future Values</h1>
          <PastAndFutureValuesTable
            items={item.allValues}
            includeLimit
            includeFuelClass
          />
        </Tab>
      </Tabs>
    )
  }

  return <Loading />
}

CarbonIntensityLimitDetailContainer.defaultProps = {}

CarbonIntensityLimitDetailContainer.propTypes = {
  carbonIntensityLimit: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getCarbonIntensityLimit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
}

const mapStateToProps = state => ({
  carbonIntensityLimit: {
    isFetching: state.rootReducer.carbonIntensityLimits.isGetting,
    item: state.rootReducer.carbonIntensityLimits.item,
    success: state.rootReducer.carbonIntensityLimits.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
})

const mapDispatchToProps = {
  getCarbonIntensityLimit: carbonIntensities.get
}

export default connect(mapStateToProps, mapDispatchToProps)(CarbonIntensityLimitDetailContainer)
