/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class SnapshotDisplay extends Component {
  static decimalViewer(digits = 2) {
    return cell => Number(cell.value).toFixed(digits)
      .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  static buildExclusionAgreement(snapshot) {
    const grid = [
      [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Transaction Type'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Fuel Type'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Legal Name of Transaction Partner'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Address of Transaction Partner'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Quantity'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Units'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Quantity not sold or supplied within the Compliance Period'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Units'
      }]
    ];

    if (snapshot.exclusionAgreement) {
      snapshot.exclusionAgreement.records.forEach((row) => {
        grid.push([{
          className: 'left',
          readOnly: true,
          value: row.transactionType
        }, {
          className: 'left',
          readOnly: true,
          value: row.fuelType
        }, {
          className: 'left',
          readOnly: true,
          value: row.transactionPartner
        }, {
          className: 'left',
          readOnly: true,
          value: row.postalAddress
        }, {
          readOnly: true,
          value: row.quantity,
          valueViewer: SnapshotDisplay.decimalViewer(0)
        }, {
          className: 'center',
          readOnly: true,
          value: row.unitOfMeasure
        }, {
          readOnly: true,
          value: row.quantityNotSold,
          valueViewer: SnapshotDisplay.decimalViewer(0)
        }, {
          className: 'center',
          readOnly: true,
          value: row.unitOfMeasure
        }]);
      });
    }
    return grid;
  }

  render() {
    const {snapshot} = this.props;

    return (
      <div className="snapshot">

        {this.props.computedWarning &&
        <div className="panel panel-warning">
          <FontAwesomeIcon icon="exclamation-triangle"/>Showing a live view of the data, not a snapshot.
        </div>
        }
        {this.props.dirtyWarning &&
        <div className="panel panel-warning">
          <FontAwesomeIcon icon="exclamation-triangle"/>Showing the data as at last save. If you have made changes, they
          will not be reflected until you save.
        </div>
        }
        {(snapshot.supplementalNote && snapshot.supplementalNote.length > 0) &&
        <div className={'panel panel-default'}>
          <div className={'panel-heading'}>
            Supplemental Submission Explanation
          </div>
          <div
            key="supplemental-note"
            className="panel-body"
          >
            <span>{snapshot.supplementalNote}</span>
          </div>
        </div>
        }

        {this.props.showHeaders && <div>
          <h1>Exclusion Report for {this.props.snapshot.compliancePeriod.description}</h1>
          <h3>{this.props.snapshot.organization.name}</h3>
          <h3>Submitted: {moment(this.props.snapshot.timestamp).format('YYYY-MM-DD')}</h3>

          <hr/>
        </div>}
        {snapshot.exclusionAgreement &&
        <div>
          <h1 className="schedule-header">Exclusion Agreement</h1>
          <hr/>
          <ReactDataSheet
            className="spreadsheet exclusion-agreement"
            data={SnapshotDisplay.buildExclusionAgreement(snapshot)}
            valueRenderer={cell => cell.value}
          />
        </div>
        }
      </div>
    );
  }
}

SnapshotDisplay.defaultProps = {
  snapshot: null,
  showHeaders: false,
  computedWarning: false,
  dirtyWarning: false
};

SnapshotDisplay.propTypes = {
  snapshot: PropTypes.shape(),
  showHeaders: PropTypes.bool,
  computedWarning: PropTypes.bool,
  dirtyWarning: PropTypes.bool
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotDisplay);
