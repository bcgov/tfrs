/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ReactTable from '../../../app/components/StateSavingReactTable';
import history from '../../../app/History';

const CarbonIntensitiesTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-title',
    Header: 'Fuel',
    id: 'title'
  }, {
    accessor: item => (item.density && item.density.toFixed(2)),
    Cell: (row) => {
      if (row.original.revisedDensity) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={(
              <Tooltip id={`tooltip-${row.original.id}`} placement="bottom">
                <div>Revised Carbon Intensity: {row.original.revisedDensity.density}</div>
                <div>Effective Date: {row.original.revisedDensity.effectiveDate}</div>
              </Tooltip>
            )}
          >
            <div className="has-revised-value">{row.value} <FontAwesomeIcon icon="info-circle" /></div>
          </OverlayTrigger>
        );
      }

      return <div>{row.value} <span className="spacer" /></div>;
    },
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
      stateKey={props.stateKey}
      className="searchable"
      columns={columns}
      data={props.items}
      defaultFilterMethod={filterMethod}
      defaultPageSize={props.defaultPageSize}
      defaultSorted={[{
        id: 'title',
        desc: false
      }]}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = props.viewUrl.replace(':id', row.original.id);

              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      pageSizeOptions={props.pageSizeOptions}
    />
  );
};

CarbonIntensitiesTable.defaultProps = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 15, 20, 25],
  stateKey: 'carbon-intensity'
};

CarbonIntensitiesTable.propTypes = {
  defaultPageSize: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  stateKey: PropTypes.string,
  viewUrl: PropTypes.string.isRequired
};

export default CarbonIntensitiesTable;
