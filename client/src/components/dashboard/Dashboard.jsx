import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAccountActivity } from '../../actions/accountActivityActions.jsx';
import * as Routes from '../../constants/routes.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import RecentAccountActivityTable from '../reusable/RecentAccountActivityTable.jsx';

class Dashboard extends Component {

  componentDidMount() {
    this.props.getAccountActivity();
  }
  
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
              <div className="recent-account-activity-container">
                <h2>Recent Account Activity</h2>
                <Link to={Routes.ACCOUNT_ACTIVITY} className="view-all">View all</Link>
              </div>
              <RecentAccountActivityTable 
                accountActivityData={this.props.accountActivityData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect (
  state => ({
    accountActivityData: state.rootReducer[ReducerTypes.GET_ACCOUNT_ACTIVITY].data,
  }),
  dispatch => ({
    getAccountActivity: () => {
      dispatch(getAccountActivity());
    }
  })
)(Dashboard)
