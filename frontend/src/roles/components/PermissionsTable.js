/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import 'react-table/react-table.css';

const Permissions = (props) => {
  const columns = [{
    id: 'name',
    Header: 'Name',
    accessor: item => (item.name)
  }, {
    id: 'description',
    Header: 'Description',
    accessor: item => (item.description)
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
      data={props.items}
      defaultSorted={[{
        id: 'permission'
      }]}
      filterable={filterable}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

Permissions.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Permissions;
