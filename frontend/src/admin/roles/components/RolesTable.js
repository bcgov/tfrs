/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import 'react-table/react-table.css';

import { ROLES } from '../../../constants/routes/Admin';

const RolesTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    className: 'col-id',
    maxWidth: 50,
    resizable: false
  }, {
    id: 'role',
    Header: 'Role',
    accessor: item => (item.description)
  }, {
    id: 'actions',
    Header: '',
    accessor: 'id',
    filterable: false,
    maxWidth: 50,
    Cell: (row) => {
      const viewUrl = ROLES.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl} key="view"><FontAwesomeIcon icon="eye" /></Link>;
    }
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
        id: 'role'
      }]}
      filterable={filterable}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

RolesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default RolesTable;
