import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAccountActivity, acceptCreditTransfer, acceptCreditTransferReset } from '../../actions/accountActivityActions';
import * as Routes from '../../constants/routes';
import * as ReducerTypes from '../../constants/reducerTypes';
import RecentAccountActivityTable from './RecentAccountActivityTable';

class Dashboard extends Component {

  componentDidMount() {
    console.log("componentDidMount")
    this.props.getAccountActivity();
    console.log("got acct Activity")
  }

  handleAcceptCreditTransfer(id, note) {
    this.props.acceptCreditTransfer(id, note);
  }
  
  render() {
    console.log("rendering...")
    return (
      <div className="dashboard">
        <div id="main-content" role="main" className="col-sm-12">
          <a id="main-content-anchor"></a>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <h2>Account Balance</h2>
              <div>
                <div className="list-group">
                  <span className="list-group-item">
                    <span className="pull-right">50</span>
                    Credits
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
                <Link to={Routes.ACCOUNT_ACTIVITY} className="view-all" id="account-activity-view-all">View all</Link>
              </div>
              <RecentAccountActivityTable 
                accountActivityData={this.props.accountActivityData}
                handleAcceptCreditTransfer={(id, note) => this.handleAcceptCreditTransfer(id, note)}
                acceptCreditTransferSuccess={this.props.acceptCreditTransferSuccess}
                acceptCreditTransferReset={() => this.props.acceptCreditTransferReset()}
                creditTradeStatuses={this.props.creditTradeStatuses}
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
    acceptCreditTransferSuccess: state.rootReducer[ReducerTypes.ACCEPT_CREDIT_TRANSFER].success,
    creditTradeStatuses: state.rootReducer[ReducerTypes.CREDIT_TRADE_STATUSES].data,
  }),
  dispatch => ({
    getAccountActivity: () => {
      dispatch(getAccountActivity());
    },
    acceptCreditTransfer: (id, note) => {
      dispatch(acceptCreditTransfer(id, note));
    },
    acceptCreditTransferReset: () => {
      dispatch(acceptCreditTransferReset());
    }
  })
)(Dashboard)
