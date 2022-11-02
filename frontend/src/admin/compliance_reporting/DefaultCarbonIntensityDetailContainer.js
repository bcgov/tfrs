/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';

import { defaultCarbonIntensities } from '../../actions/defaultCarbonIntensities';
import Loading from '../../app/components/Loading';
import PastAndFutureValuesTable from './components/PastAndFutureValuesTable';
import CarbonIntensityDetails from './components/CarbonIntensityDetails';
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations';
import { useParams } from 'react-router';

const DefaultCarbonIntensityDetailContainer = props => {
  const { id } = useParams();

  useEffect(() => {
    props.getDefaultCarbonIntensity(id);
  }, [id]);

  const { item, isFetching, success } = props.defaultCarbonIntensity;

  if (success && !isFetching && item) {
    return (
      <Tabs defaultActiveKey="details" id="citabs">
        <Tab eventKey="details" title="Current">
          <CarbonIntensityDetails
            editUrl={CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES_EDIT}
            item={item}
            loggedInUser={props.loggedInUser}
            title="Default Carbon Intensity Details"
          />
        </Tab>
        <Tab eventKey="allValues" title="Past And Future">
          <h1>Past and Future Values</h1>
          <PastAndFutureValuesTable
            items={item.allValues}
            includeLimit
          />

        </Tab>
      </Tabs>
    );
  }

  return <Loading />;
}

DefaultCarbonIntensityDetailContainer.defaultProps = {
};

DefaultCarbonIntensityDetailContainer.propTypes = {
  defaultCarbonIntensity: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape(),
    success: PropTypes.bool
  }).isRequired,
  getDefaultCarbonIntensity: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  defaultCarbonIntensity: {
    isFetching: state.rootReducer.defaultCarbonIntensities.isGetting,
    item: state.rootReducer.defaultCarbonIntensities.item,
    success: state.rootReducer.defaultCarbonIntensities.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getDefaultCarbonIntensity: defaultCarbonIntensities.get
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultCarbonIntensityDetailContainer);
