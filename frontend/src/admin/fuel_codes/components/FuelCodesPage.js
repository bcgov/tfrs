import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { FUEL_CODES } from '../../../constants/routes/Admin';
import Loading from '../../../app/components/Loading';
import * as Lang from '../../../constants/langEnUs';
import history from '../../../app/History';
import PERMISSIONS_FUEL_CODES from '../../../constants/permissions/FuelCodes';
import FuelCodesTable from './FuelCodesTable';

const FuelCodesPage = (props) => {
  const { isFetching, items } = props.fuelCodes;
  const isEmpty = items.length === 0;

  return (
    <div className="page_secure_document_upload">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.hasPermission(PERMISSIONS_FUEL_CODES.MANAGE) &&
          <button
            id="new-submission"
            className="btn btn-primary"
            onClick={() => {
              const route = FUEL_CODES.ADD.replace(':type', '');

              history.push(route);
            }}
            type="button"
          >
            <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_FUEL_CODE}
          </button>
          }
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <FuelCodesTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
        loggedInUser={props.loggedInUser}
      />
      }
    </div>
  );
};

FuelCodesPage.defaultProps = {
};

FuelCodesPage.propTypes = {
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default FuelCodesPage;
