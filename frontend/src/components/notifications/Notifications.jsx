import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { getNotifications } from '../../actions/notificationActions';
import * as ReducerTypes from '../../constants/reducerTypes';

class Notifications extends Component {

  componentDidMount() {
    this.props.getNotifications();
  }
  
  render() {
    return (
      <div className="notifications row">
        <div className="col-lg-12">
          <h1>Notifications</h1>
          <BootstrapTable 
            data={this.props.notificationsData}
              search
            >
            <TableHeaderColumn dataField="type" isKey={true} dataSort={true}>Type</TableHeaderColumn>
            <TableHeaderColumn dataField="message" dataSort={true}>Message</TableHeaderColumn>
            <TableHeaderColumn dataField="date" dataSort={true}>Date</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    );
  }
}

export default connect (
  state => ({
    notificationsData: state.rootReducer[ReducerTypes.GET_NOTIFICATIONS].data,
  }),
  dispatch => ({
    getNotifications: () => {
      dispatch(getNotifications());
    },
  })
)(Notifications)
