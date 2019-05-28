/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';

import { petroleumCarbonIntensities } from '../../actions/petroleumCarbonIntensities';
import Loading from '../../app/components/Loading';
import CarbonIntensityDetails from './components/CarbonIntensityDetails';
import PastAndFutureValuesTable from './components/PastAndFutureValuesTable';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';

class PetroleumCarbonIntensityDetailContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.getPetroleumCarbonIntensity(this.props.match.params.id);
  }

  render () {
    const { item, isFetching, success } = this.props.petroleumCarbonIntensity;

    if (success && !isFetching && item) {
      return (
        <Tabs defaultActiveKey="details" id="citabs">
          <Tab eventKey="details" title="Current">
            <CarbonIntensityDetails
              editUrl={CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_EDIT}
              item={item}
              loggedInUser={this.props.loggedInUser}
              title="Carbon Intensity Details"
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
      );
    }

    return <Loading />;
  }
}

PetroleumCarbonIntensityDetailContainer.defaultProps = {
};

PetroleumCarbonIntensityDetailContainer.propTypes = {
  getPetroleumCarbonIntensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  petroleumCarbonIntensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  petroleumCarbonIntensity: {
    isFetching: state.rootReducer.petroleumCarbonIntensities.isGetting,
    item: state.rootReducer.petroleumCarbonIntensities.item,
    success: state.rootReducer.petroleumCarbonIntensities.success
  }
});

const mapDispatchToProps = {
  getPetroleumCarbonIntensity: petroleumCarbonIntensities.get
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetroleumCarbonIntensityDetailContainer);
