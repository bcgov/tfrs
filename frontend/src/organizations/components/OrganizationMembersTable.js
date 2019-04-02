/*
 * Presentational component
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';

import history from '../../app/History';
import { USERS as ADMIN_USERS } from '../../constants/routes/Admin';
import USERS from '../../constants/routes/Users';
import ReactTable from '../../app/components/StateSavingReactTable';

const OrganizationMembersTable = (props) => {
  const columns = [{
    accessor: item => `${item.firstName} ${item.lastName}`,
    className: 'col-name',
    Header: 'Name',
    id: 'name',
    minWidth: 150
  }, {
    accessor: item => item.roles &&
      item.roles.map(role => role.description).join(', '),
    className: 'col-role',
    Header: 'Role(s)',
    id: 'role',
    minWidth: 200
  }, {
    accessor: item => item.email,
    className: 'col-email',
    Header: 'Email',
    id: 'email',
    minWidth: 200
  }, {
    accessor: item => item.phone,
    className: 'col-phone',
    Header: 'Phone',
    id: 'phone',
    minWidth: 100
  }, {
    accessor: item => (item.isActive ? 'Active' : 'Inactive'),
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 100
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
      stateKey={props.stateKey}
      className="searchable"
      data={props.items}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'name',
        desc: false
      }]}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              let viewUrl = USERS.DETAILS.replace(':id', row.original.id);

              if (document.location.pathname.indexOf('/admin/') >= 0) {
                viewUrl = ADMIN_USERS.DETAILS.replace(':id', row.original.id);
              }

              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

OrganizationMembersTable.defaultProps = {
  stateKey: 'organizations-members'
};

OrganizationMembersTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.number,
    isActive: PropTypes.bool,
    lastName: PropTypes.string,
    role: PropTypes.shape({
      id: PropTypes.number
    })
  })).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  stateKey: PropTypes.string
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(OrganizationMembersTable);
