/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import {getOrganization, getOrganizationMembers, updateOrganization} from '../actions/organizationActions';
import Loading from '../app/components/Loading';
import OrganizationDetails from './components/OrganizationDetails';
import OrganizationMembers from './components/OrganizationMembers';
import OrganizationEditForm from "./components/OrganizationEditForm";

class OrganizationEditContainer extends Component {


  constructor (props) {
    super(props);

    this.state = {
      fields: {
        name: '',
        country: ''
      },
      validationErrors: {}
    };
    this.submitted = false;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }
  componentWillReceiveProps(props) {
    this.loadPropsToFieldState(props);
  }

  loadPropsToFieldState (props) {
    if (Object.keys(props.organization.details).length !== 0 && !this.submitted) {
      const org = props.organization.details;
      let addr = {};

      if (org.organizationAddress != null) {
        addr = {
            ...org.organizationAddress
          };
      }

      console.log('got new props');
      console.log(props);
      this.setState({
        fields: {
          name: props.organization.details.name,
          status: props.organization.details.status,
          actionsType: props.organization.details.actionsType,
          ...addr
        }
      });

    }
  }

  loadData (id) {
    this.props.getOrganization(id);
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event) {
    event.preventDefault();

    const data = {
      ...this.state.fields
    };
    this.props.updateOrganization(data, this.props.match.params.id)

    //
    // const data = this.props.prepareCreditTransfer(this.state.fields);
    // const { comment } = this.state.fields;
    //
    // if (comment.length > 0) {
    //   data.comment = comment;
    // }
    //
    // this.props.addCreditTransfer(data).then((response) => {
    //   this.props.invalidateCreditTransfers();
    //   this.loadData();
    //   this.resetState();
    // });

    return false;
  }

  render () {
    const {isFetching} = this.props.organization;
    return (
      <div>
      {isFetching && <Loading/>}
      {isFetching || <OrganizationEditForm
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
      />}
      </div>
    )
  }
}

OrganizationEditContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  organization: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    }),
    isFetching: PropTypes.bool
  }).isRequired,
  updateOrganization: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  organization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getOrganization: bindActionCreators(getOrganization, dispatch),
  updateOrganization: bindActionCreators(updateOrganization, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationEditContainer);
