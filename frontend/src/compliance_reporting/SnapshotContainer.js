/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import {complianceReporting} from '../actions/complianceReporting';
import Loading from '../app/components/Loading';
import history from '../app/History';
import SnapshotDisplay from './components/SnapshotDisplay';
import CONFIG from '../config';
import * as Lang from '../constants/langEnUs';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import DeltasDisplay from "./components/DeltasDisplay";

class SnapshotContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'tables'
    };
  }

  componentDidMount() {
    this.props.getSnapshotRequest(this.props.match.params.id);
    this.props.getDeltasRequest(this.props.match.params.id);
  }

  render() {
    if (this.props.loading || this.props.loadingDeltas) {
      return (<Loading/>);
    }

    return (
      <div>
        <div>
          <ul className="schedule-tabs nav nav-tabs">

            <li className="nav-item">
              <button
                className={`nav-link ${this.state.active === 'tables' ? 'active' : ''}`}
                href="#"
                onClick={() => {
                  this.setState({active: 'tables'});
                }}
                type="button"
              >
                Tables
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${this.state.active === 'deltas' ? 'active' : ''}`}
                href="#"
                onClick={() => {
                  this.setState({active: 'deltas'});
                }}
                type="button"
              >
                Deltas
              </button>
            </li>
            {CONFIG.DEBUG.ENABLED &&
            <li className="nav-item">
              <button
                className={`nav-link ${this.state.active === 'rawjson' ? 'active' : ''}`}
                onClick={() => {
                  this.setState({active: 'rawjson'});
                }}
                type="button"
              >Raw JSON
              </button>
            </li>}
            {CONFIG.DEBUG.ENABLED &&
            <li className="nav-item">
              <button
                className={`nav-link ${this.state.active === 'rawdeltas' ? 'active' : ''}`}
                onClick={() => {
                  this.setState({active: 'rawdeltas'});
                }}
                type="button"
              >Raw Deltas
              </button>
            </li>
            }
          </ul>
        </div>

        {(CONFIG.DEBUG.ENABLED && this.state.active === 'rawjson') &&
        <div>
          <h1>Data Snapshot</h1>
          <p>A record of the contents of the report at the moment it was submitted.</p>
          <hr/>
          <ReactJson
            src={this.props.snapshot}
            theme="monokai"
            iconStyle="triangle"
            style={{
              fontFamily: ['Source Code Pro', 'monospace'],
              fontSize: '16px'
            }}
            displayDataTypes={false}
            enableClipboard={false}
            sortKeys
          />
        </div>
        }
        {(CONFIG.DEBUG.ENABLED && this.state.active === 'rawdeltas') &&
        <div>
          <h1>Deltas Snapshot</h1>
          <p>A computed difference between this report and ancestors.</p>
          <hr/>
          <ReactJson
            src={this.props.deltas}
            theme="monokai"
            iconStyle="triangle"
            style={{
              fontFamily: ['Source Code Pro', 'monospace'],
              fontSize: '16px'
            }}
            displayDataTypes={false}
            enableClipboard={false}
            sortKeys
          />
        </div>
        }
        {this.state.active === 'tables' &&
        <div>
          <SnapshotDisplay snapshot={this.props.snapshot}/>
        </div>
        }
        {this.state.active === 'deltas' &&
        <div>
          <DeltasDisplay deltas={this.props.deltas}/>
        </div>
        }
        <div className="snapshot-buttons">
          <button
            className="btn btn-default"
            type="button"
            onClick={() => {
              const url = COMPLIANCE_REPORTING.EDIT
                .replace(':id', this.props.match.params.id)
                .replace(':tab', 'intro');

              history.push(url);
            }}
          >
            <FontAwesomeIcon icon="arrow-circle-left"/> {Lang.BTN_APP_CANCEL}
          </button>
        </div>
      </div>
    );
  }
}

SnapshotContainer.defaultProps = {
  snapshot: null,
  deltas: null
};

SnapshotContainer.propTypes = {
  snapshot: PropTypes.shape(),
  deltas: PropTypes.shape(),
  loading: PropTypes.bool.isRequired,
  loadingDeltas: PropTypes.bool.isRequired,
  getSnapshotRequest: PropTypes.func.isRequired,
  getDeltasRequest: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  snapshot: state.rootReducer.complianceReporting.snapshotItem,
  deltas: state.rootReducer.complianceReporting.deltasItem,
  loading: state.rootReducer.complianceReporting.isGettingSnapshot,
  loadingDeltas: state.rootReducer.complianceReporting.isGettingDeltas
});

const mapDispatchToProps = {
  getSnapshotRequest: complianceReporting.getSnapshot,
  getDeltasRequest: complianceReporting.getDeltas
};

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotContainer);
