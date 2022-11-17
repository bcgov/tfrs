import React, { Component } from 'react'
import Loading from '../app/components/Loading'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getCompliancePeriods from '../actions/compliancePeriodsActions'

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function withReferenceData (config) {
  return function (WrappedComponent) {
    class ReferenceDataSupport extends Component {
      componentDidMount () {
        if (config && config.includeCompliancePeriods) {
          this.props.getCompliancePeriods()
        }
      }

      render () {
        if (this.props.referenceData.isFetching) {
          return (<Loading/>)
        }
        if (config && config.includeCompliancePeriods) {
          // wait for compliance periods
          if (this.props.compliancePeriods.isFetching) {
            return (<Loading/>)
          }
        }
        return (<WrappedComponent {...this.props} />)
      }
    }

    ReferenceDataSupport
      .displayName = `ReferenceDataSupport(${getDisplayName(WrappedComponent)})`

    const
      mapStateToProps = state => ({
        referenceData: state.rootReducer.referenceData,
        compliancePeriods: state.rootReducer.compliancePeriods
      })
    const mapDispatchToProps = dispatch => ({
      getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
    })

    return connect(mapStateToProps, mapDispatchToProps)(ReferenceDataSupport)
  }
}

export default withReferenceData
