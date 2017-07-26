import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccountActivityTable from '../reusable/AccountActivityTable.jsx';

var products = [{
      id: 1,
      name: "Item name 1",
      price: {
        price: 100,
        id: 1,
      }
  },{
      id: 2,
      name: "Item name 2",
      price: {
        price: 100,
        id: 2,
      }
  }];

class Dashboard extends Component {
  
  render() {
    return (
      <div className="dashboard">
        <div id="main-content" role="main" className="contentPageMainColumn col-sm-12">
          <a id="main-content-anchor"></a>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <h2>Account Balance</h2>
              <div>
                <div className="list-group">
                  <span className="list-group-item">
                    <span className="pull-right">50</span>
                    Available Balance of Validated Credits
                  </span>
                  <span className="list-group-item">
                    <span className="pull-right">55</span>
                    Validated Credits
                  </span>
                  <span className="list-group-item">
                    <span className="pull-right">5</span>
                    Encumbered by Proposed Transfer
                  </span>
                </div>
              </div>
              <a className="more-link" href="/account-activity">More</a>
            </div>
            <div className="col-xs-12 col-sm-6">
              <h2>Notifications</h2>
              <div className="list-group notification-list">
                <a href="#" data-toggle="modal" className="list-group-item">
                  <span className="notification-item">
                  </span>
                  <span className="pull-right"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h2>Recent Account Activity</h2>
              <table id="recent-account-activity-table"></table>
              <AccountActivityTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state
  }),
  dispatch => ({})
)(Dashboard)
