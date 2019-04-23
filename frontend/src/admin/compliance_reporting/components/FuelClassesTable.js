/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import 'react-table/react-table.css';

import ReactTable from '../../../app/components/StateSavingReactTable';

const FuelClassesTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: 'Fuel Type',
    id: 'title'
  }, {
    accessor: item => (item.fuelClasses.length > 0
      ? item.fuelClasses.map(fuelClass => fuelClass.fuelClass).join('/') : ''),
    className: 'col-classes',
    Header: 'Fuel Classes',
    id: 'classes'
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
      stateKey="fuel-classes"
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

FuelClassesTable.defaultProps = {};

FuelClassesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired
};

export default FuelClassesTable;
