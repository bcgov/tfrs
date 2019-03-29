/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

import history from '../../../app/History';
import { FUEL_CODES } from '../../../constants/routes/Admin';
import ReactTable from '../../../app/components/StateSavingReactTable';

const FuelCodesTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  }, {
    accessor: item => `${item.fuelCode}${item.fuelCodeVersion}${item.fuelCodeVersionMinor ? `.${item.fuelCodeVersionMinor}` : ''}`,
    className: 'col-title',
    Header: 'Low Carbon Fuel Code',
    id: 'title',
    width: 200
  }, {
    accessor: item => item.company,
    className: 'col-company',
    Header: 'Company',
    id: 'company',
    width: 200
  }, {
    accessor: item => item.carbonIntensity,
    className: 'col-carbon-intensity',
    Header: 'Carbon Intensity',
    id: 'carbon-intensity',
    width: 150
  }, {
    accessor: item => item.applicationDate,
    className: 'col-date',
    Header: 'Application Date',
    id: 'application-date',
    width: 150
  }, {
    accessor: item => item.effectiveDate,
    className: 'col-date',
    Header: 'Effective Date',
    id: 'effective-date',
    width: 150
  }, {
    accessor: item => item.expiryDate,
    className: 'col-date',
    Header: 'Expiry Date',
    id: 'expiry-date',
    width: 150
  }, {
    accessor: item => item.fuel,
    className: 'col-fuel',
    Header: 'Fuel',
    id: 'fuel',
    width: 150
  }, {
    accessor: item => item.feedstock,
    className: 'col-feedstock',
    Header: 'Feedstock',
    id: 'feedstock',
    width: 200
  }, {
    accessor: item => item.feedstockLocation,
    className: 'col-feedstock-location',
    Header: 'Feedstock Location',
    id: 'feedstock-location',
    width: 200
  }, {
    accessor: item => item.feedstockMisc,
    className: 'col-feedstock-misc',
    Header: 'Feedstock Misc',
    id: 'feedstock-misc',
    width: 200
  }, {
    accessor: item => item.facilityLocation,
    className: 'col-facility-loc',
    Header: 'Fuel Production Facility Location',
    id: 'facility-loc',
    width: 250
  }, {
    accessor: item => (item.facilityNameplate ? item.facilityNameplate.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : ''),
    className: 'col-facility-nameplate',
    Header: 'Fuel Production Facility Nameplate Capacity',
    id: 'facility-nameplate',
    width: 300
  }, {
    accessor: item => item.feedstockTransportMode && item.feedstockTransportMode.join(', '),
    className: 'col-feedstock-transport-mode',
    Header: 'Feedstock Transport Mode',
    id: 'feedstock-transport-mode',
    width: 250
  }, {
    accessor: item => item.fuelTransportMode && item.fuelTransportMode.join(', '),
    className: 'col-fuel-transport-mode',
    Header: 'Finished Fuel Transport Mode',
    id: 'fuel-transport-mode',
    width: 250
  }, {
    accessor: item => item.formerCompany,
    className: 'col-former-company',
    Header: 'Former Company',
    id: 'former-company',
    width: 200
  }, {
    accessor: item => item.approvalDate,
    className: 'col-date',
    Header: 'Approval Date',
    id: 'approval-date',
    width: 150
  }, {
    accessor: item => item.status.status,
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    width: 100
  }, {
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp',
    width: 150
  }, {
    accessor: 'id',
    Cell: (row) => {
      const viewUrl = FUEL_CODES.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}><FontAwesomeIcon icon="box-open" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    width: 50
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
      stateKey="fuel-codes"
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
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = FUEL_CODES.DETAILS.replace(':id', row.original.id);

              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

FuelCodesTable.defaultProps = {};

FuelCodesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    createUser: PropTypes.shape({
      organization: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    status: PropTypes.shape({
      status: PropTypes.string
    })
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default FuelCodesTable;
