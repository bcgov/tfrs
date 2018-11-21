/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import FuelCodeFormDetails from './FuelCodeFormDetails';
import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';
import Errors from '../../../app/components/Errors';

const FuelCodeForm = props => (
  <div className="page_admin_fuel_code">
    <h1>{props.title}</h1>
    <form
      onSubmit={event => props.handleSubmit(event)}
    >
      <FuelCodeFormDetails
        addToFields={props.addToFields}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
      />

      {Object.keys(props.errors).length > 0 &&
      <Errors errors={props.errors} />
      }

      <div className="fuel-code-actions">
        <div className="btn-container">
          <button
            className="btn btn-default"
            onClick={() => history.goBack()}
            type="button"
          >
            <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
          </button>
          <button
            className="btn btn-default"
            type="submit"
          >
            <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
          </button>
          <button
            className="btn btn-primary"
            data-target="#confirmSubmit"
            data-toggle="modal"
            type="button"
          >
            <FontAwesomeIcon icon="plus" /> {Lang.BTN_ADD}
          </button>
        </div>
      </div>
    </form>
  </div>
);

FuelCodeForm.defaultProps = {
  errors: []
};

FuelCodeForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  errors: PropTypes.shape(),
  fields: PropTypes.shape({
    roles: PropTypes.array
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default FuelCodeForm;
