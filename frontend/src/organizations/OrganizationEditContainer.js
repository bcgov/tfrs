/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import {getOrganization, getOrganizationMembers, updateOrganization} from '../actions/organizationActions';
import Loading from '../app/components/Loading';
import OrganizationDetails from './components/OrganizationDetails';
import OrganizationMembers from './components/OrganizationMembers';
import OrganizationEditForm from "./components/OrganizationEditForm";
import history from "../app/History";
import toastr from "../utils/toastr";
import {USERS as ADMIN_USERS} from "../constants/routes/Admin";
import ORGANIZATION from "../constants/routes/Organizations";
import Errors from "../app/components/Errors";

class OrganizationEditContainer extends Component {


  constructor(props) {
    super(props);

    this.state = {
      fields: {
        name: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        postalCode: '',
        state: '',
        county: '',
        country: '',
        type: '2',
        actionsType: '1',
        status: '1'
      },
      validationErrors: {}
    };
    this.submitted = false;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.mode === 'add')
      return;

    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps(prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  componentWillReceiveProps(props) {
    if (props.mode === 'add')
      return;

    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState(props) {
    if (Object.keys(props.organization.details).length !== 0 && !this.submitted) {
      const org = props.organization.details;
      let addr = {};

      if (org.organizationAddress != null) {
        addr = {
          ...org.organizationAddress
        };
      }

      this.setState({
        fields: {
          name: props.organization.details.name,
          status: props.organization.details.status,
          actionsType: props.organization.details.actionsType,
          type: props.organization.details.type,
          ...addr
        }
      });

    }
  }

  loadData(id) {
    this.props.getOrganization(id);
  }

  _handleInputChange(event) {
    const {value, name} = event.target;
    const fieldState = {...this.state.fields};

    fieldState[name] = value;
    this.setState({
      fields: fieldState
    });
  }

  _handleSubmit(event) {
    event.preventDefault();

    const data = {
      ...this.state.fields
    };

    const viewUrl = ORGANIZATION.DETAILS.replace(':id', this.props.match.params.id);


    this.props.updateOrganization(data, this.props.match.params.id).then(() => {
      history.push(viewUrl);
      toastr.organizationSuccess();
    });

    return false;
  }

  render() {
    const isFetching = this.props.organization.isFetching ||
      this.props.referenceData.isFetching;
    if (isFetching) {
      return (<Loading/>);
    }

    switch (this.props.mode) {
      case 'add':
        return (<p>add mode</p>);
      case 'gov_edit':
      case 'edit':
        return (<OrganizationEditForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          referenceData={this.props.referenceData}
          handleSubmit={this._handleSubmit}
        />);
      default:
        return (<div/>);
    }
  }
}

OrganizationEditContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  organization: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      status: PropTypes.string,
      type: PropTypes.string,
      actionsType: PropTypes.string
    }),
    isFetching: PropTypes.bool
  }),
  referenceData: PropTypes.shape({
    organizationTypes: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.number
      })),
    organizationActionsTypes: PropTypes.arrayOf(
      PropTypes.shape({
        the_type: PropTypes.string,
        id: PropTypes.number
      })),
    organizationStatuses: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        id: PropTypes.number
      })),
    isFetching: PropTypes.bool
  }),
  updateOrganization: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'admin_edit'])
};

const mapStateToProps = state => ({
  organization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  },
  referenceData: {
    organizationTypes: state.rootReducer.referenceData.data.organizationTypes,
    organizationStatuses: state.rootReducer.referenceData.data.organizationStatuses,
    organizationActionsTypes: state.rootReducer.referenceData.data.organizationActionsTypes,
    isFetching: state.rootReducer.referenceData.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getOrganization: bindActionCreators(getOrganization, dispatch),
  updateOrganization: bindActionCreators(updateOrganization, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationEditContainer);
