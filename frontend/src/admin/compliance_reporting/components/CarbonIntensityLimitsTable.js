/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import 'react-table/react-table.css';

import ReactTable from '../../../app/components/StateSavingReactTable';

const CarbonIntensityLimitsTable = (props) => {
  const columns = [{
    accessor: item => item.description,
    className: 'col-compliance-period',
    Header: (
      <div className="header-compliance-period">Compliance Period</div>
    ),
    id: 'title'
  }, {
    accessor: item => (item.limits.diesel ? item.limits.diesel.density : 0).toFixed(2),
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
    accessor: item => (item.limits.diesel ? item.limits.gasoline.density : 0).toFixed(2),
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
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

CarbonIntensityLimitsTable.defaultProps = {};

CarbonIntensityLimitsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default CarbonIntensityLimitsTable;
