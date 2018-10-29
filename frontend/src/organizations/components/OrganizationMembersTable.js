/*
 * Presentational component
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';

import { USERS as ADMIN_USERS } from '../../constants/routes/Admin';
import PERMISSIONS_USERS from '../../constants/permissions/Users';
import USERS from '../../constants/routes/Users';

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
    className: 'col-status-display',
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
  }, {
    accessor: item => item.id,
    Cell: (row) => {
      let editUrl = USERS.EDIT.replace(':id', row.value);
      let viewUrl = USERS.DETAILS.replace(':id', row.value);

      if (document.location.pathname.indexOf('/admin/') >= 0) {
        editUrl = ADMIN_USERS.EDIT.replace(':id', row.value);
        viewUrl = ADMIN_USERS.DETAILS.replace(':id', row.value);
      }

      if (props.loggedInUser.hasPermission(PERMISSIONS_USERS.EDIT_FUEL_SUPPLIER_USERS)) {
        return ([
          <Link to={viewUrl} key="view"><FontAwesomeIcon icon="eye" /></Link>,
          <Link to={editUrl} key="edit"><FontAwesomeIcon icon="pencil-alt" /></Link>
        ]);
      }

      return <Link to={viewUrl} key="view"><FontAwesomeIcon icon="eye" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
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
      data={props.items}
      defaultPageSize={15}
      defaultSorted={[{
        id: 'name',
        desc: false
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
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
  }).isRequired
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(OrganizationMembersTable);
