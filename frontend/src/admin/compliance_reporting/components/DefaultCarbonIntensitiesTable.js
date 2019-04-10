/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import 'react-table/react-table.css';

import ReactTable from '../../../app/components/StateSavingReactTable';

const CarbonIntensitiesTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: 'Fuel',
    id: 'title'
  }, {
    accessor: item => item.carbonIntensity,
    className: 'col-density',
    Header: (
      <div>
        Carbon Intensity (gCO<sub>2</sub>e/MJ)
      </div>
    ),
    id: 'carbon-intensity',
    width: 250
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
      stateKey="carbon-intensity"
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

CarbonIntensitiesTable.defaultProps = {};

CarbonIntensitiesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default CarbonIntensitiesTable;
