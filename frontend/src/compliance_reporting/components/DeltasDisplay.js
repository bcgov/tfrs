/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactJson from 'react-json-view';


class DeltasDisplay extends Component {
  render() {
    const {deltas} = this.props;
    const valueRenderer = row => {
      if (row.value === null) {
        return (<em>null</em>)
      }
      if (row.value instanceof Object) {
        return (
          <ReactJson
            src={row.value}
            theme="grayscale:inverted"
            iconStyle="triangle"
            style={{
              fontFamily: ['Source Code Pro', 'monospace'],
              fontSize: '10px'
            }}
            displayDataTypes={false}
            enableClipboard={false}
            sortKeys
          />
        )
      }
      return (<span>{row.value}</span>);
    };
    return (
      <div className="deltas">
        {
          deltas.map(d => {
              const columns =
                [
                  {
                    id: 'field',
                    Header: 'Field',
                    accessor: item => {
                      let result;
                      if (Number.isInteger(item.field)) {
                        result = '[' + item.field + ']';
                      } else {
                        result = '.' + item.field
                      }
                      if (item.path !== null && item.path !== '') {
                        return item.path + result;
                      } else {
                        return item.field;
                      }
                    },
                  },
                  {
                    id: 'action',
                    Header: 'Action',
                    accessor: item => (item.action),
                  },
                  {
                    id: 'oldvalue',
                    Header: 'Old Value',
                    accessor: item => (item.old_value),
                    Cell: valueRenderer
                  },
                  {
                    id: 'newvalue',
                    Header: 'New Value',
                    accessor: item => (item.new_value),
                    Cell: valueRenderer
                  },
                  {
                    id: 'delta',
                    Header: 'Delta',
                    accessor: item => {
                      const ov = Number.parseFloat(item.old_value);
                      const nv = Number.parseFloat(item.new_value);
                      if (Number.isNaN(ov) || Number.isNaN(nv)) {
                        return 'N/A'
                      }
                      return nv - ov;

                    }
                  }
                ];

              return (
                <div key={d.ancestor_id}>
                  <h2>Delta to {d.ancestor_display_name}</h2>

                  <ReactTable
                    columns={columns}
                    data={d.delta}
                    filterable
                    sortable
                    defaultPageSize={d.delta.length}
                  />

                </div>
              );
            }
          )
        }
      </div>
    );
  }
}

DeltasDisplay.defaultProps = {
  deltas: []
};

DeltasDisplay.propTypes = {
  deltas: PropTypes.array
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DeltasDisplay);
