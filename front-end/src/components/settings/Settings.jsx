import React, { Component } from 'react';
import { connect } from 'react-redux';

class Settings extends Component {
  
  render() {
    return (
      <div className="settings">
        <div id="main-content" role="main" className="contentPageMainColumn col-sm-12">
            <a id="main-content-anchor"></a>
            <div className="row">
              <h2>Notification Settings</h2>
              <ul className="nav nav-tabs" role="tablist">
                <li role="presentation" className="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Contact Info</a></li>
                <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Alerts</a></li>
              </ul>
              <div className="tab-content">
              <div role="tabpanel" className="tab-pane active" id="home">
                <div className="row">
                  <div className="well well-sm">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium posuere luctus. Aenean volutpat massa sit amet odio sollicitudin, sit amet aliquet dui interdum. Nullam dignissim, velit id elementum varius, ex turpis lobortis dui, eget ornare massa turpis quis enim. Mauris vel posuere nibh. In vehicula nisl ac tincidunt faucibus. Pellentesque dolor dui, feugiat vel ex non, condimentum hendrerit purus. Suspendisse bibendum est nisi, at vehicula massa iaculis quis. Nulla facilisi. Quisque faucibus risus eget dictum interdum. Sed nunc purus, laoreet ut facilisis eget, convallis sed leo.</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-lg-6 transaction-item">
                    <p>
                    <div className="col-xs-4">
                      <label>SMS:</label>
                    </div>
                    </p>
                    <div className="col-xs-8">
                      <input type="text" id="phone" className="form-control" placeholder="Enter your mobile number" />
                    </div>

                  </div>
                  <div className="col-xs-12 col-lg-6 transaction-item">
                    <p>
                    <div className="col-xs-4">
                      <label>Email:</label>
                    </div>
                    </p>
                    <div className="col-xs-8">
                      <input type="text" id="email" className="form-control" placeholder="Enter your email" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <button type="button" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-default">Cancel</button>
                </div>
              </div>
              <div role="tabpanel" className="tab-pane" id="profile">
                <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                  <div className="panel panel-default">
                    <div className="panel-heading" role="tab" id="headingOne">
                      <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#balanceAlerts" aria-expanded="false" aria-controls="balanceAlerts">
                          Balance Alerts
                        </a>
                      </h4>
                    </div>
                    <div id="balanceAlerts" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                      <div className="panel-body">
                        <button type="button" className="btn btn-primary">Email</button>
                        <button type="button" className="btn btn-default">SMS</button>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading" role="tab" id="headingTwo">
                      <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#draftSaved" aria-expanded="false" aria-controls="draftSaved">
                          Draft Saved
                        </a>
                      </h4>
                    </div>
                    <div id="draftSaved" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                      <div className="panel-body">
                        <button type="button" className="btn btn-primary">Email</button>
                        <button type="button" className="btn btn-default">SMS</button>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading" role="tab" id="headingThree">
                      <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#transactionProposed" aria-expanded="false" aria-controls="transactionProposed">
                          Transaction Proposed
                        </a>
                      </h4>
                    </div>
                    <div id="transactionProposed" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                      <div className="panel-body">
                        <button type="button" className="btn btn-primary">Email</button>
                        <button type="button" className="btn btn-default">SMS</button>
                      </div>
                    </div>
                  </div>
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab" id="headingFour">
                    <h4 className="panel-title">
                      <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#transactionApproved" aria-expanded="false" aria-controls="transactionApproved">
                        Transaction Approved
                      </a>
                    </h4>
                  </div>
                  <div id="transactionApproved" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
                    <div className="panel-body">
                      <button type="button" className="btn btn-primary">Email</button>
                      <button type="button" className="btn btn-default">SMS</button>
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading" role="tab" id="headingFive">
                      <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#transactionPending" aria-expanded="false" aria-controls="transactionPending">
                          Transaction Pending
                        </a>
                      </h4>
                    </div>
                  <div id="transactionPending" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
                    <div className="panel-body">
                      <button type="button" className="btn btn-primary">Email</button>
                      <button type="button" className="btn btn-default">SMS</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(Settings)
