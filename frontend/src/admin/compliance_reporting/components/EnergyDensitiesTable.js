/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import 'react-table/react-table.css';

import ReactTable from '../../../app/components/StateSavingReactTable';

const EnergyDensitiesTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: 'Fuel',
    id: 'title'
  }, {
    accessor: item => (item.density && item.density.toFixed(2)),
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
