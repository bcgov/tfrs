import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import { getOpportunities } from '../../actions/opportunitiesActions.jsx';

class Opportunities extends Component {

  componentDidMount() {
    this.props.getOpportunities();
  }

  actionsFormatter(cell, row) {
    return (
      <div>
        <Link to="">Edit</Link>
      </div>
    )
  }
  
  createCustomOurOpportunitiesSearch(props) {
    return (
      <div>
        <h2 className='header'>Our Opportunities</h2>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="btn btn-primary">Add</button>
            <label className="checkbox"> 
              <input type="checkbox" />
              Open Only
            </label>
          </div>
          { props.components.searchPanel }
        </div>
      </div>
    );
  }

  createCustomOpenOpportunitiesSearch(props) {
    return (
      <div>
        <h2 className='header'>Open Opportunities</h2>
        <div className='right-toolbar-container'> 
          { props.components.searchPanel }
        </div>
      </div>
    );
  }
  
  render() {
    const options = {
      toolBar: this.createCustomOurOpportunitiesSearch.bind(this)
    };
    const openOpportunitiesOptions = {
      toolBar: this.createCustomOpenOpportunitiesSearch.bind(this)
    };
    return (
      <div className="row opportunities">
        <h1 className="col-lg-12">Opportunities</h1>
        <div className="col-lg-12 our-opportunities-table">
          <BootstrapTable 
            data={this.props.opportunitiesData}
            options={ options }
            search
          >
            <TableHeaderColumn dataField="opportunity_description" isKey={true} dataSort={true} columnClassName="proposal-description">Proposal Description</TableHeaderColumn>
            <TableHeaderColumn dataField="resulting_transfers" dataSort={true}>Resulting Transfers</TableHeaderColumn>
            <TableHeaderColumn dataField="last_updated" dataSort={true}>Last Updated</TableHeaderColumn>
            <TableHeaderColumn dataField="status" dataSort={true}>Status</TableHeaderColumn>
            <TableHeaderColumn dataField="id" dataFormat={(cell, row) => this.actionsFormatter(cell, row)}>Actions</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div className="col-lg-12 open-opportunities-table">
          <BootstrapTable 
            data={this.props.opportunitiesData}
            options={ openOpportunitiesOptions }
            search
          >
            <TableHeaderColumn dataField="opportunity_description" isKey={true} dataSort={true} columnClassName="proposal-description">Proposal Description</TableHeaderColumn>
            <TableHeaderColumn dataField="resulting_transfers" dataSort={true}>Resulting Transfers</TableHeaderColumn>
            <TableHeaderColumn dataField="last_updated" dataSort={true}>Last Updated</TableHeaderColumn>
            <TableHeaderColumn dataField="status" dataSort={true}>Status</TableHeaderColumn>
            <TableHeaderColumn dataField="id" dataFormat={(cell, row) => this.actionsFormatter(cell, row)}>Actions</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    );
  }
}

export default connect (
  state => ({
    opportunitiesData: state.rootReducer[ReducerTypes.GET_OPPORTUNITIES].data,
  }),
  dispatch => ({
    getOpportunities: () => {
      dispatch(getOpportunities());
    }
  })
)(Opportunities)
