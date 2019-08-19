/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {complianceReporting} from '../actions/complianceReporting';
import ReactJson from 'react-json-view';

import Loading from "../app/components/Loading";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../app/History';

import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import SnapshotDisplay from "./components/SnapshotDisplay";
import CONFIG from "../config";

class SnapshotContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: 'tables'
    }
  }

  componentDidMount() {
    this.props.getSnapshotRequest(this.props.match.params.id);
  }

  render() {
    if (this.props.loading) {
      return (<Loading/>);
    }

    const urls = {
      edit: COMPLIANCE_REPORTING.EDIT
        .replace(':id', this.props.match.params.id)
        .replace(':tab', 'intro')
    };

    return (
      <div>
        {CONFIG.DEBUG.ENABLED &&
        <div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${this.state.active === 'tables' ? 'active' : ''}`}
                href="#"
                onClick={() => {
                  this.setState({active: 'tables'});
                }}
              >Tables</a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${this.state.active === 'rawjson' ? 'active' : ''}`}
                href="#"
                onClick={() => {
                  this.setState({active: 'rawjson'});
                }}
              >Raw JSON</a>
            </li>
          </ul>
        </div>
        }
        {(CONFIG.DEBUG.ENABLED && this.state.active === 'rawjson') &&
        <div>
          <h1>Data Snapshot</h1>
          < p> A record of the contents of the report at the moment it was submitted</p>,
          <hr/>
          <ReactJson
            src={this.props.snapshot}
            theme='monokai'
            iconStyle='triangle'
            style={{
              'fontFamily': ['Source Code Pro', 'monospace'],
              'fontSize': '16px'
            }}
            displayDataTypes={false}
            enableClipboard={false}
            sortKeys={true}
          />
        </div>
        }
        {this.state.active === 'tables' &&
        <div>
          <SnapshotDisplay snapshot={this.props.snapshot}/>
        </div>
        }
        < button
          className="btn btn-default"
          type="button"
          onClick={() => {
            history.push(urls.snapshot)
          }}
        >
          <FontAwesomeIcon icon="arrow-circle-left"/> Back
        </button>
      </div>
    );
  }
}


SnapshotContainer.defaultProps = {
  snapshot: null,
};

SnapshotContainer.propTypes = {
  snapshot: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  getSnapshotRequest: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  snapshot: state.rootReducer.complianceReporting.snapshotItem,
  loading: state.rootReducer.complianceReporting.isGettingSnapshot
});

const mapDispatchToProps = {
  getSnapshotRequest: complianceReporting.getSnapshot
};

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotContainer);
