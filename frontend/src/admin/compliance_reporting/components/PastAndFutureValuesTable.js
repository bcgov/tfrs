/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import 'react-table/react-table.css';

import ReactTable from '../../../app/components/StateSavingReactTable';

const PastAndFutureValuesTable = (props) => {
  const valueColumns = [];

  if (props.includeDensity) {
    valueColumns.push({
      accessor: item => item.density.toFixed(2),
      Header: `Density MJ/${props.densityUnit}`,
      id: 'density'
    });
  }

  if (props.includeLimit) {
    valueColumns.push({
      accessor: item => item.density.toFixed(2),
      Header: 'Limit (gCO₂e/MJ)',
      id: 'limit'
    });
  }

  if (props.includeFuelClass) {
    valueColumns.push({
      accessor: item => item.fuelClass,
      Header: 'Fuel Class',
      id: 'fuel-class'
    });
  }

  if (props.includeRatio) {
    valueColumns.push({
      accessor: item => item.ratio.toFixed(1),
      Header: 'Ratio',
      id: 'ratio'
    });
  }

  const dateColumns = [{
    accessor: item => item.effectiveDate,
    className: 'col-date',
    Header: 'Effective Date',
    id: 'effective-date'
  }, {
    accessor: item => item.expirationDate || 'N/A',
    className: 'col-date',
    Header: 'Expiration Date',
    id: 'expiration-date'
  }, {
    accessor: item => moment(item.createTimestamp).format('YYYY-MM-DD HH[:]mm'),
    className: 'col-date',
    Header: 'Updated',
    id: 'create-timestamp'
  }];

  const columns = [...valueColumns, ...dateColumns];

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };

  const filterable = true;

  return (
    <ReactTable
      saveState={false}
      stateKey="unused"
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

PastAndFutureValuesTable.defaultProps = {
  includeDensity: false,
  includeLimit: false,
  includeRatio: false,
  includeFuelClass: false,
  densityUnit: ''
};

PastAndFutureValuesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  includeDensity: PropTypes.bool,
  includeLimit: PropTypes.bool,
  includeRatio: PropTypes.bool,
  includeFuelClass: PropTypes.bool,
  densityUnit: PropTypes.string
};

export default PastAndFutureValuesTable;
