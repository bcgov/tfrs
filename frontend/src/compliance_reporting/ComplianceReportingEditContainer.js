/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch, withRouter} from 'react-router';
import {toastr as reduxToastr} from 'react-redux-toastr';
import PropTypes from 'prop-types';

import {complianceReporting} from '../actions/complianceReporting';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import ScheduleAContainer from "./ScheduleAContainer";
import ScheduleBContainer from "./ScheduleBContainer";
import ScheduleCContainer from "./ScheduleCContainer";
import ScheduleDContainer from "./ScheduleDContainer";
import withReferenceData from "../utils/reference_data_support";
import ComplianceReportIntroContainer from "./ComplianceReportIntroContainer";
import Loading from "../app/components/Loading";
import ScheduleTabs from "./components/ScheduleTabs";
import Modal from "../app/components/Modal";
import history from "../app/History";
import toastr from "../utils/toastr";
import autosaved from "../utils/autosave_support";
import AutosaveNotifier from "./components/AutosaveNotifier";

class ComplianceReportingEditContainer extends Component {

  constructor(props) {
    super(props);
    this.tabComponent = Loading;
    let {tab} = props.match.params;
    this.tabComponent = ComplianceReportingEditContainer._componentForTabName(tab);

    this.edit = document.location.pathname.indexOf('/edit/') >= 0
    this._updateScheduleState = this._updateScheduleState.bind(this);
    this._updateAutosaveState = this._updateAutosaveState.bind(this);
    this.loadData = this.loadData.bind(this);

    this.state = {
      schedules: {},
      autosaveState: {}
    };
  }

  componentDidMount() {
    if (this.edit) {
      this.loadData();
    }
  }

  loadData() {
    this.props.getComplianceReport(this.props.match.params.id);
  }

  static _componentForTabName(tab) {

    let TabComponent;

    switch (tab) {

      case 'schedule-a':
        TabComponent = withReferenceData()(ScheduleAContainer);
        break;

      case 'schedule-b':
        TabComponent = withReferenceData()(ScheduleBContainer);
        break;

      case 'schedule-c':
        TabComponent = withReferenceData()(ScheduleCContainer);
        break;

      case 'schedule-d':
        TabComponent = withReferenceData()(ScheduleDContainer);
        break;

      case 'intro':
      default:
        TabComponent = ComplianceReportIntroContainer;
        break;
    }
    return TabComponent;
  }

  _updateScheduleState(mergedState) {
    let {schedules} = this.state;

    this.setState({
      schedules: {
        ...schedules,
        ...mergedState
      }
    });

  }

  _handleDelete() {
    if (this.edit) {
      this.props.deleteComplianceReport({id: this.props.match.params.id});
    }
    history.push(COMPLIANCE_REPORTING.LIST);
    toastr.complianceReporting('Cancelled');
    this.props.invalidateAutosaved();
  }

  _handleSubmit() {

    if (!this.edit) {
      // creating new
      const payload = {
        status: 'Draft',
        type: 'Compliance Report',
        compliancePeriod: this.props.match.params.period,
        ...this.state.schedules
      };

      this.props.createComplianceReport(payload);
    } else {
      // patch existing
      const payload = {
        ...this.state.schedules
      };
      this.props.updateComplianceReport({
        id: this.props.match.params.id,
        state: payload,
        patch: true
      });
    }
  }


  componentWillReceiveProps(nextProps, nextContext) {

    let {tab} = nextProps.match.params;
    if (tab !== this.props.match.params.tab) {
      this.tabComponent = ComplianceReportingEditContainer._componentForTabName(tab);
    }

    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error saving');
      } else {
        history.push(COMPLIANCE_REPORTING.LIST);
        toastr.complianceReporting('Draft');
        this.props.invalidateAutosaved();
      }
      return;
    }

    if (this.props.complianceReporting.isUpdating && !nextProps.complianceReporting.isUpdating) {
      if (!nextProps.complianceReporting.success) {
        reduxToastr.error('Error saving');
      } else {
        history.push(COMPLIANCE_REPORTING.LIST);
        toastr.complianceReporting('Draft');
        this.props.invalidateAutosaved();
      }
    }


  }

  _updateAutosaveState(tab, state) {
    const autosaveState = {
      ...this.state.autosaveState,
      tab: state
    };
    this.setState({
      autosaveState
    });

    this.props.updateStateToSave(autosaveState);
  }

  render() {

    const TabComponent = this.tabComponent;
    let {tab, id, period} = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    if (this.props.complianceReporting.isGetting) {
      return (<Loading/>);
    }

    if (this.edit) {
      if (this.props.complianceReporting.item) {
        period = this.props.complianceReporting.item.compliancePeriod.description;
        if (!period) {
          return (<Loading/>);
        }
      }
    }

    return ([
      <ScheduleTabs
        active={tab}
        compliancePeriod={period}
        edit={this.edit}
        id={id}
        key="nav"
      />,
      <TabComponent
        edit={this.edit}
        key="tab-component"
        period={period}
        id={id}
        create={!this.edit}
        complianceReport={this.props.complianceReporting.item}
        updateScheduleState={this._updateScheduleState}
        saving={this.props.saving}
        updateAutosaveState={(state) => {
          this._updateAutosaveState(tab, state)
        }}
      />,

      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to save this schedule?
      </Modal>,
      <Modal
        handleSubmit={event => this._handleDelete(event)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    ]);

  }
  ;
}

ComplianceReportingEditContainer
  .propTypes = {
  invalidateAutosaved: PropTypes.func.isRequired,
  loadedState: PropTypes.any,
  saving: PropTypes.bool.isRequired,
  updateStateToSave: PropTypes.func.isRequired
};

const
  mapDispatchToProps = {
    createComplianceReport: complianceReporting.create,
    updateComplianceReport: complianceReporting.update,
    deleteComplianceReport: complianceReporting.remove,
    getComplianceReport: complianceReporting.get
  };

const
  mapStateToProps = state => ({
    complianceReporting: {
      isGetting: state.rootReducer.complianceReporting.isGetting,
      isFinding: state.rootReducer.complianceReporting.isFinding,
      isCreating: state.rootReducer.complianceReporting.isCreating,
      isUpdating: state.rootReducer.complianceReporting.isUpdating,
      success: state.rootReducer.complianceReporting.success,
      item: state.rootReducer.complianceReporting.item,
      errorMessage: state.rootReducer.complianceReporting.errorMessage
    },
    referenceData: {
      approvedFuels: state.rootReducer.referenceData.data.approvedFuels,
      isFetching: state.rootReducer.referenceData.isFetching
    }
  });


const
  config = {
    key: 'unsaved',
    version: 2,
    name: 'compliance-report'
  };


export default connect(mapStateToProps, mapDispatchToProps)(autosaved(config)(ComplianceReportingEditContainer));
