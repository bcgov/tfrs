/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tab, Tabs } from 'react-bootstrap'

import { energyDensities } from '../../actions/energyDensities'
import Loading from '../../app/components/Loading'
import EnergyDensityDetails from './components/EnergyDensityDetails'
import PastAndFutureValuesTable from './components/PastAndFutureValuesTable'
import { useParams } from 'react-router'

const EnergyDensityDetailContainer = props => {
  const { id } = useParams()

  useEffect(() => {
    props.getEnergyDensity(id)
  }, [id])

  const { item, isFetching, success } = props.energyDensity

  if (success && !isFetching && item) {
    return (
      <Tabs defaultActiveKey="details" id="citabs">
        <Tab eventKey="details" title="Current">
          <EnergyDensityDetails
            item={item}
            loggedInUser={props.loggedInUser}
            title="Energy Density Details"
          />
        </Tab>
        <Tab eventKey="allValues" title="Past And Future">
          <h1>Past and Future Values</h1>
          <PastAndFutureValuesTable
            items={item.allValues}
            includeDensity
            densityUnit={item.unitOfMeasure}
          />
        </Tab>
      </Tabs>
    )
  }

  return <Loading />
}

EnergyDensityDetailContainer.defaultProps = {
}

EnergyDensityDetailContainer.propTypes = {
  energyDensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getEnergyDensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
}

const mapStateToProps = state => ({
  energyDensity: {
    isFetching: state.rootReducer.energyDensities.isGetting,
    item: state.rootReducer.energyDensities.item,
    success: state.rootReducer.energyDensities.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
})

const mapDispatchToProps = {
  getEnergyDensity: energyDensities.get
}

export default connect(mapStateToProps, mapDispatchToProps)(EnergyDensityDetailContainer)
