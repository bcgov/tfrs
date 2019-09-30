/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import {fuelClasses} from '../actions/fuelClasses';
import {notionalTransferTypes} from '../actions/notionalTransferTypes';
import AddressBuilder from '../app/components/AddressBuilder';
import Input from '../app/components/Spreadsheet/Input';
import OrganizationAutocomplete from '../app/components/Spreadsheet/OrganizationAutocomplete';
import Select from '../app/components/Spreadsheet/Select';
import SchedulesPage from './components/SchedulesPage';
import {SCHEDULE_A, SCHEDULE_A_ERROR_KEYS} from '../constants/schedules/scheduleColumns';
import DeltasDisplay from "./components/DeltasDisplay";
import Loading from "../app/components/Loading";

class ChangelogContainer extends Component {

  constructor(props) {
    super(props);
    this.state = this._recomputeDerivedStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._recomputeDerivedStateFromProps(nextProps));
  }

  componentDidMount () {
    if (this.props.snapshot) {
      this.componentWillReceiveProps(this.props);
    } else {
      if (this.props.complianceReport && !this.props.complianceReport.hasSnapshot) {
        this.props.recomputeRequest();
      }
    }
  }

  _recomputeDerivedStateFromProps(nextProps) {
    if (nextProps.recomputedTotals.deltas) {
      return {deltas: nextProps.recomputedTotals.deltas};
    } else if (nextProps.complianceReport.deltas) {
      return {deltas: nextProps.complianceReport.deltas};
    }
    return {deltas: null};
  }

  render() {
    if (!this.props.valid) {
      return (<p>Please fix validation issues in other schedules</p>);
    }

    if (this.props.recomputing || this.props.isValidating) {
      return (<Loading/>);
    }

    if (this.state.deltas) {
      return (<DeltasDisplay deltas={this.state.deltas}/>);
    } else {
      return (<Loading/>)
    }
  }

}

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChangelogContainer);
