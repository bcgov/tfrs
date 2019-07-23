import React, {Component} from 'react';
import Loading from "../app/components/Loading";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Errors from "../app/components/Errors";
import getCreditCalculation from "../actions/creditCalculation";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withCreditCalculationValues(config) {
  return function (WrappedComponent) {

    class CreditCalculationValuesSupport extends Component {

      componentDidMount() {
        // super.componentDidMount();

        // const compliancePeriod = this.props.compliancePeriods.find(period =>
        //   period.description === this.props.period);

        this.props.getCreditCalculation(selectedFuel.id, {
          compliance_period_id: config.compliance_period_id
        });

      }

      render() {

        if (this.props.referenceData.isFetching) {
          return (<Loading/>);
        } else if (!this.props.creditCalculation.success) {
          return (<Errors errors={'error loading credit calculation data'}/>)
        } else {
          return (<WrappedComponent {...this.props}/>)
        }

      }
    }

    CreditCalculationValuesSupport
      .displayName = `CreditCalculationValuesSupport(${getDisplayName(WrappedComponent)})`;

    const
      mapStateToProps = (state) => {
        return {
          creditCalculation: {
            isFetching: state.rootReducer.creditCalculation.isFetching,
            item: state.rootReducer.creditCalculation.item,
            success: state.rootReducer.creditCalculation.success
          }
        }
      };

    const mapDispatchToProps = (dispatch) => {
      return {
        getCreditCalculation: bindActionCreators(getCreditCalculation, dispatch)
      };
    };


    return connect(mapStateToProps, mapDispatchToProps)(CreditCalculationValuesSupport);
  }

};


export default withCreditCalculationValues;
