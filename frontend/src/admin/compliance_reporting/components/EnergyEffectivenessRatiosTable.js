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

const EnergyEffectivenessRatiosTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: (
      <div className="header-fuel">Fuel</div>
    ),
    id: 'title'
  }, {
    accessor: item => (
      item.dieselRatio ? item.dieselRatio.toFixed(1) : 'N/A'
    ),
    Cell: (row) => {
      if (row.original.revisedDieselRatio) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id={`tooltip-${row.original.id}`} placement="bottom">
                <div>
                  Revised Energy Effectiveness Ratio:
                  {` ${row.original.revisedDieselRatio.ratio}`}
                </div>
                <div>Effective Date: {row.original.revisedDieselRatio.effectiveDate}</div>
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
        Diesel Class Fuel<br />
        Energy Effectiveness Ratio
      </div>
    ),
    id: 'diesel',
    width: 200
  }, {
    accessor: item => (
      item.gasolineRatio ? item.gasolineRatio.toFixed(1) : 'N/A'
    ),
    Cell: (row) => {
      if (row.original.revisedGasolineRatio) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id={`tooltip-${row.original.id}`} placement="bottom">
                <div>
                  Revised Energy Effectiveness Ratio:
                  {` ${row.original.revisedGasolineRatio.ratio}`}
                </div>
                <div>Effective Date: {row.original.revisedGasolineRatio.effectiveDate}</div>
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
        Gasoline Class Fuel<br />
        Energy Effectiveness Ratio
      </div>
    ),
    id: 'gasoline',
    width: 200
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
      stateKey="energy-effectiveness-ratio"
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
              const viewUrl = CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO_DETAILS.replace(':id', row.original.id);

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

EnergyEffectivenessRatiosTable.defaultProps = {};

EnergyEffectivenessRatiosTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default EnergyEffectivenessRatiosTable;
