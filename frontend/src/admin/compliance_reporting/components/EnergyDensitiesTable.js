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

const EnergyDensitiesTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: 'Fuel',
    id: 'title'
  }, {
    accessor: item => (item.density && item.density.toFixed(2)),
    Cell: (row) => {
      if (row.original.revisedDensity) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id={`tooltip-${row.original.id}`} placement="bottom">
                <div>Revised Energy Density: {row.original.revisedDensity.density}</div>
                <div>Effective Date: {row.original.revisedDensity.effectiveDate}</div>
              </Tooltip>
            )}
          >
            <div className="has-revised-value">{row.value} <FontAwesomeIcon icon="info-circle" /></div>
          </OverlayTrigger>
        );
      }

      return <div>{row.value} <span className="spacer" /></div>;
    },
    className: 'col-density',
    Header: 'Energy Density',
    id: 'energy-density',
    width: 150
  }, {
    accessor: item => (item.unitOfMeasure && `MJ/${item.unitOfMeasure}`),
    Header: 'Unit',
    id: 'unit of measure',
    width: 100
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
      stateKey="energy-density"
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
              const viewUrl = CREDIT_CALCULATIONS.ENERGY_DENSITIES_DETAILS.replace(':id', row.original.id);

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

EnergyDensitiesTable.defaultProps = {};

EnergyDensitiesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default EnergyDensitiesTable;
