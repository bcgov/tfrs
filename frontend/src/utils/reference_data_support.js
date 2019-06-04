import React, {Component} from 'react';
import Loading from "../app/components/Loading";
import {connect} from "react-redux";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withReferenceData(config) {
  return function (WrappedComponent) {

    class ReferenceDataSupport extends Component {

      render() {

        if (this.props.referenceData.isFetching) {
          return (<Loading/>);
        } else {
          return (<WrappedComponent {...this.props}/>)
        }

      }
    }

    ReferenceDataSupport
      .displayName = `ReferenceDataSupport(${getDisplayName(WrappedComponent)})`;

    const
      mapStateToProps = (state) => {
        return {
          referenceData: state.rootReducer.referenceData
        }
      };


    return connect(mapStateToProps, null)(ReferenceDataSupport);
  }

};


export default withReferenceData;
