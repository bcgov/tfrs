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

class SnapshotContainer extends Component {

  constructor(props) {
    super(props);
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
      [<h1>Data Snapshot</h1>,
        <p>A record of the contents of the report at the moment it was submitted</p>,
        <hr/>,
        <ReactJson
          src={this.props.snapshot}
          // theme='monokai'
          iconStyle='triangle'
          style={{
            'fontFamily': ['Hack', 'Source Code Pro', 'monospace'],
            'fontSize': '18px'
          }}
          displayDataTypes={false}
          enableClipboard={false}
          sortKeys={true}
        />,
        <button
          className="btn btn-default"
          type="button"
          onClick={() => {
            history.push(urls.snapshot)
          }}
        >
          <FontAwesomeIcon icon="arrow-circle-left"/> Back
        </button>
      ])
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
