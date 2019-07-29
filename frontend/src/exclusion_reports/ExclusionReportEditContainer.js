/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports';
import ExclusionAgreementContainer from './ExclusionAgreementContainer';
import ExclusionReportIntroContainer from './ExclusionReportIntroContainer';
import withReferenceData from '../utils/reference_data_support';
import Loading from '../app/components/Loading';
import ExclusionReportButtons from './components/ExclusionReportButtons';
import ExclusionReportTabs from './components/ExclusionReportTabs';
import Modal from '../app/components/Modal';
import history from '../app/History';
import autosaved from '../utils/autosave_support';

class ExclusionReportEditContainer extends Component {
  static componentForTabName (tab) {
    let TabComponent;

    switch (tab) {
      case 'exclusion-agreement':
        TabComponent = withReferenceData()(ExclusionAgreementContainer);
        break;

      default:
        TabComponent = ExclusionReportIntroContainer;
    }

    return TabComponent;
  }

  constructor (props) {
    super(props);
    this.tabComponent = Loading;
    const { tab } = props.match.params;
    this.tabComponent = ExclusionReportEditContainer.componentForTabName(tab);

    this.edit = document.location.pathname.indexOf('/edit/') >= 0;
    this._updateScheduleState = this._updateScheduleState.bind(this);
    this._updateAutosaveState = this._updateAutosaveState.bind(this);
    this.loadData = this.loadData.bind(this);

    this.state = {
      schedules: {},
      autosaveState: {}
    };
  }

  componentDidMount () {
    if (this.edit) {
      this.loadData();
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { tab } = nextProps.match.params;

    if (tab !== this.props.match.params.tab) {
      this.tabComponent = ExclusionReportEditContainer.componentForTabName(tab);
    }
  }

  _updateScheduleState (mergedState) {
    const { schedules } = this.state;

    this.setState({
      schedules: {
        ...schedules,
        ...mergedState
      }
    });
  }

  _handleDelete () {
    history.push(EXCLUSION_REPORTS.LIST);
    this.props.invalidateAutosaved();
  }

  _handleSubmit () {
  }

  loadData () {
  }

  _updateAutosaveState (tab, state) {
    const autosaveState = {
      ...this.state.autosaveState,
      tab: state
    };
    this.setState({
      autosaveState
    });

    this.props.updateStateToSave(autosaveState);
  }

  render () {
    const TabComponent = this.tabComponent;

    const { tab, id } = this.props.match.params;
    let { period } = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    return ([
      <ExclusionReportTabs
        active={tab}
        compliancePeriod={period}
        edit={this.edit}
        id={id}
        key="nav"
      />,
      <TabComponent
        key="tab-component"
        period={period}
        id={id}
        create={!this.edit}
        exclusionReport={this.props.exclusionReport.item}
        loadedState={this.props.loadedState}
        loggedInUser={this.props.loggedInUser}
        updateScheduleState={this._updateScheduleState}
        updateAutosaveState={(state) => {
          this._updateAutosaveState(tab, state);
        }}
      />,
      <ExclusionReportButtons
        edit={this.edit}
        key="exclusionReportButtons"
        submit
        delete
        saving={this.props.saving}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to save this exclusion report?
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
}

ExclusionReportEditContainer.defaultProps = {
  exclusionReport: {
    isCreating: false,
    success: false
  },
  loadedState: null
};

ExclusionReportEditContainer.propTypes = {
  exclusionReport: PropTypes.shape({
    isCreating: PropTypes.bool,
    isGetting: PropTypes.bool,
    isUpdating: PropTypes.bool,
    item: PropTypes.shape({
      compliancePeriod: PropTypes.oneOfType([
        PropTypes.shape({
          description: PropTypes.string
        }),
        PropTypes.string
      ])
    }),
    success: PropTypes.bool
  }),
  invalidateAutosaved: PropTypes.func.isRequired,
  loadedState: PropTypes.shape(),
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string,
      tab: PropTypes.string
    }).isRequired
  }).isRequired,
  saving: PropTypes.bool.isRequired,
  updateStateToSave: PropTypes.func.isRequired
};

const
  mapDispatchToProps = {
  };

const
  mapStateToProps = state => ({
    loggedInUser: state.rootReducer.userRequest.loggedInUser,
    referenceData: {
      approvedFuels: state.rootReducer.referenceData.data.approvedFuels,
      isFetching: state.rootReducer.referenceData.isFetching
    }
  });

const
  config = {
    key: '-',
    version: 3,
    name: 'exclusion-report',
    customPathGenerator: (props) => {
      if (props.match.path.indexOf('/edit/') >= 0) {
        return `edit:${props.match.params.id}`;
      } else if (props.match.path.indexOf('/add/') >= 0) {
        return `add:${props.match.params.period}`;
      }
      return props.location.pathname;
    }
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(autosaved(config)(ExclusionReportEditContainer));
