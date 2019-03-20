/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import 'react-table/react-table.css';

import { ROLES } from '../../constants/routes/Admin';
import history from '../../app/History';
import StateSavingReactTable from "../../app/components/StateSavingReactTable";

const OrganizationRolesTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    maxWidth: 50,
    resizable: false
  }, {
    accessor: item => (item.description),
    Header: 'Role',
    id: 'role'
  }, {
    accessor: 'id',
    Cell: (row) => {
      const viewUrl = ROLES.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl} key="view"><FontAwesomeIcon icon="box-open" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    maxWidth: 50
  }];

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };

  const filterable = true;

  return (
    <StateSavingReactTable
      stateKey="organizations-roles"
      className="searchable"
      data={props.items}
      defaultFilterMethod={filterMethod}
      defaultSorted={[{
        id: 'role'
      }]}
      defaultPageSize={10}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = ROLES.DETAILS.replace(':id', row.original.id);
              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      columns={columns}
    />
  );
};

OrganizationRolesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default OrganizationRolesTable;
