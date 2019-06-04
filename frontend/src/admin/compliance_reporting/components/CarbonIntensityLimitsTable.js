/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ReactTable from '../../../app/components/StateSavingReactTable';
import history from '../../../app/History';
import CREDIT_CALCULATIONS from '../../../constants/routes/CreditCalculations';

const CarbonIntensityLimitsTable = (props) => {
  const columns = [{
    accessor: item => item.description,
    className: 'col-compliance-period',
    Header: (
      <div className="header-compliance-period">Compliance Period</div>
    ),
    id: 'title'
  }, {
    accessor: item => (item.limits.diesel && item.limits.diesel.density
      ? item.limits.diesel.density : 0).toFixed(2),
    Cell: (row) => {
      if (row.original.revisedLimits && row.original.revisedLimits.diesel) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id={`tooltip-${row.original.id}`} placement="bottom">
                <div>Revised Carbon Intensity Limit:
                  {` ${row.original.revisedLimits.diesel.density}`}
                </div>
                <div>Effective Date: {row.original.revisedLimits.diesel.effectiveDate}</div>
              </Tooltip>
            )}
          >
            <div className="has-revised-value">{row.value} <FontAwesomeIcon icon="info-circle" /></div>
          </OverlayTrigger>
        );
      }

      return <div>{row.value} <span className="spacer" /></div>;
    },
    className: 'col-diesel',
    Header: (
      <div>
        Carbon Intensity Limit for Diesel Class Fuel
        <div className="unit-of-measure">(gCO<sub>2</sub>e/MJ)</div>
      </div>
    ),
    id: 'diesel',
    width: 300
  }, {
    accessor: item => (item.limits.gasoline && item.limits.gasoline.density
      ? item.limits.gasoline.density : 0).toFixed(2),
    Cell: (row) => {
      if (row.original.revisedLimits && row.original.revisedLimits.gasoline) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id={`tooltip-${row.original.id}`} placement="bottom">
                <div>Revised Carbon Intensity Limit:
                  {` ${row.original.revisedLimits.gasoline.density}`}
                </div>
                <div>Effective Date: {row.original.revisedLimits.gasoline.effectiveDate}</div>
              </Tooltip>
            )}
          >
            <div className="has-revised-value">{row.value} <FontAwesomeIcon icon="info-circle" /></div>
          </OverlayTrigger>
        );
      }

      return <div>{row.value} <span className="spacer" /></div>;
    },
    className: 'col-gasoline',
    Header: (
      <div>
        Carbon Intensity Limit for Gasoline Class Fuel
        <div className="unit-of-measure">(gCO<sub>2</sub>e/MJ)</div>
      </div>
    ),
    id: 'gasoline',
    width: 300
  }];

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };

  const filterable = true;

  return (
    <ReactTable
      stateKey="carbon-intensity-limit"
      className="searchable"
      columns={columns}
      data={props.items}
      defaultFilterMethod={filterMethod}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'title',
        desc: false
      }]}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = CREDIT_CALCULATIONS.CARBON_INTENSITIES_DETAILS.replace(':id', row.original.id);

              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      pageSizeOptions={[5, 10, 15, 20, 25]}
    />
  );
};

CarbonIntensityLimitsTable.defaultProps = {};

CarbonIntensityLimitsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CarbonIntensityLimitsTable;
