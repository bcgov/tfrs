import React, {Component} from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";
import saveTableState from "../../actions/stateSavingReactTableActions";

class StateSavingReactTable extends Component {

  constructor(props) {
    super(props);

    this._pageChanged = this._pageChanged.bind(this);
    this._pageSizeChanged = this._pageSizeChanged.bind(this);
    this._sortedChanged = this._sortedChanged.bind(this);
    this._filteredChange = this._filteredChange.bind(this);

  }

  _pageSizeChanged(pageSize, pageIndex) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      pageSize: pageSize,
      page: pageIndex
    });
  }

  _pageChanged(pageIndex) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      page: pageIndex
    });
  }

  _sortedChanged(newSorted, column, shiftKey) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      sorted: newSorted,
    });
  }

  _filteredChange(filtered, column) {
    this.props.saveTableState(this.props.stateKey, {
      ...this.props.tableState,
      filtered: filtered
    });
  }

  render() {
    if (this.props.saveState) {
      return <ReactTable
        page={this.props.tableState.page}
        pageSize={this.props.tableState.pageSize}
        sorted={this.props.tableState.sorted}
        filtered={this.props.tableState.filtered}
        onPageChange={this._pageChanged}
        onPageSizeChange={this._pageSizeChanged}
        onSortedChange={this._sortedChanged}
        onFilteredChange={this._filteredChange}
        {...this.props} />;
    } else {
      return <ReactTable
        {...this.props} />;
    }
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
  defaultSorted: PropTypes.array,
  defaultFiltered: PropTypes.array,
  tableState: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  tableState:
    ownProps.stateKey in state.rootReducer.tableState.savedState ?
      state.rootReducer.tableState.savedState[ownProps.stateKey] : {
        page: 0,
        pageSize: ownProps.defaultPageSize,
        sorted: ownProps.defaultSorted,
        filtered: ownProps.defaultFiltered,
      }
});

const mapDispatchToProps = dispatch => ({
  saveTableState: bindActionCreators(saveTableState, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StateSavingReactTable);


