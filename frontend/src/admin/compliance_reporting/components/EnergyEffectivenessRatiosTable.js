/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import 'react-table/react-table.css';

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
