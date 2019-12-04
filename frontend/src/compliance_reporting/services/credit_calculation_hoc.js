import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loading from '../../app/components/Loading';

import ComplianceReportingService from './ComplianceReportingService';

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withCreditCalculationService (config) {
  return function (WrappedComponent) {
    class CreditCalculationServiceSupport extends Component {
      constructor (props) {
        super(props);

        this.state = {
          ready: false
        };
      }

      componentDidMount () {
        ComplianceReportingService.loadData(this.props.period).then(() => {
          this.setState({ ready: true });
        });
      }

      render () {
        if (!this.state.ready) {
          return (<Loading />);
        }
        return (<WrappedComponent {...this.props} />);
      }
    }

    CreditCalculationServiceSupport
      .displayName = `CreditCalculationServiceSupport(${getDisplayName(WrappedComponent)})`;

    CreditCalculationServiceSupport.propTypes = {
      period: PropTypes.string.isRequired
    };

    return connect(null, null)(CreditCalculationServiceSupport);
  };
}

export default withCreditCalculationService;
