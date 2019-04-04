/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import 'react-table/react-table.css';

import ReactTable from '../../../app/components/StateSavingReactTable';

const EnergyEffectivenessRatiosTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: 'Compliance Period',
    id: 'title'
  }, {
    accessor: item => (item.energyEffectivenessRatio.diesel ? item.energyEffectivenessRatio.diesel.ratio.toFixed(1) : 'N/A'),
    className: 'col-diesel',
    Header: (
      <div>
        Diesel Class Fuel<br />
        Energy Effectiveness Ratio
      </div>
    ),
    id: 'diesel'
  }, {
    accessor: item => (item.energyEffectivenessRatio.gasoline ? item.energyEffectivenessRatio.gasoline.ratio.toFixed(1) : 'N/A'),
    className: 'col-gasoline',
    Header: (
      <div>
        Gasoline Class Fuel<br />
        Energy Effectiveness Ratio
      </div>
    ),
    id: 'gasoline'
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
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

EnergyEffectivenessRatiosTable.defaultProps = {};

EnergyEffectivenessRatiosTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default EnergyEffectivenessRatiosTable;
