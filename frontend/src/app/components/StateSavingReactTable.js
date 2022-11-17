import React, { Component } from 'react'
import ReactTable from 'react-table'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import saveTableState from '../../actions/stateSavingReactTableActions'

class ModifiedReactTable extends ReactTable {
  /*
  This is copied from the source code of React Table.
  We're modifying this since filteredData was trying to look for subRowsKey
  for EACH of the row and it's breaking our filters.
  So we're modifying it that it just returns true
  */
  filterData (data, filtered, defaultFilterMethod, allVisibleColumns) {
    let filteredData = data

    if (filtered.length) {
      filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
        const column = allVisibleColumns.find(x => x.id === nextFilter.id)

        // Don't filter hidden columns or columns that have had their filters disabled
        if (!column || column.filterable === false) {
          return filteredSoFar
        }

        const filterMethod = column.filterMethod || defaultFilterMethod

        // If 'filterAll' is set to true, pass the entire dataset to the filter method
        if (column.filterAll) {
          return filterMethod(nextFilter, filteredSoFar, column)
        }
        return filteredSoFar.filter(row => filterMethod(nextFilter, row, column))
      }, filteredData)

      // Apply the filter to the subrows if we are pivoting, and then
      // filter any rows without subcolumns because it would be strange to show
      filteredData = filteredData
        .map((row) => {
          if (!row[this.props.subRowsKey]) {
            return row
          }
          return {
            ...row,
            [this.props.subRowsKey]: this.filterData(
              row[this.props.subRowsKey],
              filtered,
              defaultFilterMethod,
              allVisibleColumns
            )
          }
        })
    }

    return filteredData
  }
}

class StateSavingReactTable extends Component {
  constructor (props) {
    super(props)

    this._pageChanged = this._pageChanged.bind(this)
    this._pageSizeChanged = this._pageSizeChanged.bind(this)
    this._sortedChanged = this._sortedChanged.bind(this)
    this._filteredChange = this._filteredChange.bind(this)
  }

  _pageSizeChanged (pageSize, pageIndex) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      pageSize,
      page: pageIndex
    })
  }

  _pageChanged (pageIndex) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      page: pageIndex
    })
  }

  _sortedChanged (newSorted, column, shiftKey) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      sorted: newSorted
    })
  }

  _filteredChange (filtered, column) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      filtered,
      page: 0 // reset the page number after filtering
    })
  }

  render () {
    if (this.props.saveState) {
      return (
        <ModifiedReactTable
          page={this.props.tableState.page}
          pageSize={this.props.tableState.pageSize}
          sorted={this.props.tableState.sorted}
          filtered={this.props.tableState.filtered}
          onPageChange={this._pageChanged}
          onPageSizeChange={this._pageSizeChanged}
          onSortedChange={this._sortedChanged}
          onFilteredChange={this._filteredChange}
          {...this.props}
        />
      )
    }

    return <ReactTable {...this.props} />
  }
}

StateSavingReactTable.defaultProps = {
  saveState: true,
  defaultPageSize: 5,
  defaultSorted: [],
  defaultFiltered: []
}

StateSavingReactTable.propTypes = {
  stateKey: PropTypes.string.isRequired,
  saveState: PropTypes.bool,
  defaultPageSize: PropTypes.number,
  defaultSorted: PropTypes.arrayOf(PropTypes.shape()),
  defaultFiltered: PropTypes.arrayOf(PropTypes.shape()),
  tableState: PropTypes.shape().isRequired,
  saveTableState: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  tableState:
    ownProps.stateKey in state.rootReducer.tableState.savedState
      ? state.rootReducer.tableState.savedState[ownProps.stateKey]
      : {
          page: 0,
          pageSize: ownProps.defaultPageSize,
          sorted: ownProps.defaultSorted,
          filtered: ownProps.defaultFiltered
        }
})

const mapDispatchToProps = dispatch => ({
  saveTableState: bindActionCreators(saveTableState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StateSavingReactTable)
