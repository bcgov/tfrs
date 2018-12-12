/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { addOrganization, getOrganization, updateOrganization } from '../actions/organizationActions';
import Loading from '../app/components/Loading';
import OrganizationEditForm from './components/OrganizationEditForm';
import history from '../app/History';
import toastr from '../utils/toastr';
import ORGANIZATION from '../constants/routes/Organizations';
import Modal from '../app/components/Modal';

class OrganizationEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        name: '',
        addressLine_1: '',
        addressLine_2: '',
        addressLine_3: '',
        city: '',
        postalCode: '',
        state: '',
        county: '',
        country: '',
        type: 2,
        actionsType: 1,
        status: 1
      }
    };

    this.submitted = false;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleCreate = this._handleCreate.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);
  }

  componentDidMount () {
    if (this.props.mode === 'add') {
      return;
    }

    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    if (props.mode === 'add') {
      return;
    }

    this.loadPropsToFieldState(props);
  }

  loadData (id) {
    this.props.getOrganization(id);
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

  _modalConfirm () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._handleCreate();
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this Fuel Supplier?
      </Modal>
    );
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };
    const numericFields = ['type', 'actionsType', 'status'];

    if (numericFields.includes(name)) {
      fieldState[name] = parseInt(value, 10);
    } else {
      fieldState[name] = value;
    }

    this.setState({
      fields: fieldState
    });
  }

  _handleUpdate (event) {
    event.preventDefault();

    const data = {
      name: this.state.fields.name,
      type: this.state.fields.type,
      actionsType: this.state.fields.actionsType,
      status: this.state.fields.status,
      organizationAddress: {
        addressLine_1: this.state.fields.addressLine_1,
        addressLine_2: this.state.fields.addressLine_2,
        addressLine_3: this.state.fields.addressLine_3,
        city: this.state.fields.city,
        postalCode: this.state.fields.postalCode,
        state: this.state.fields.state,
        county: this.state.fields.county,
        country: this.state.fields.country
      }
    };

    const viewUrl = ORGANIZATION.DETAILS.replace(':id', this.props.match.params.id);

    this.props.updateOrganization(data, this.props.match.params.id).then(() => {
      history.push(viewUrl);
      toastr.organizationSuccess();
    });

    return false;
  }

  _handleCreate () {
    const data = {
      name: this.state.fields.name,
      type: this.state.fields.type,
      actionsType: this.state.fields.actionsType,
      status: this.state.fields.status,
      organizationAddress: {
        addressLine_1: this.state.fields.addressLine_1,
        addressLine_2: this.state.fields.addressLine_2,
        addressLine_3: this.state.fields.addressLine_3,
        city: this.state.fields.city,
        postalCode: this.state.fields.postalCode,
        state: this.state.fields.state,
        county: this.state.fields.county,
        country: this.state.fields.country
      }
    };

    this.props.addOrganization(data).then((id) => {
      const viewUrl = ORGANIZATION.DETAILS.replace(':id', id);
      history.push(viewUrl);
      toastr.organizationSuccess('Organization created.');
    });

    return false;
  }

  render () {
    const isFetching = this.props.organization.isFetching ||
      this.props.referenceData.isFetching ||
      !this.props.referenceData.isSuccessful;

    if (isFetching) {
      return (<Loading />);
    }

    switch (this.props.mode) {
      case 'add':
        return ([<OrganizationEditForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          referenceData={this.props.referenceData}
          handleSubmit={() => {
            $('#confirmSubmit').modal('show');
          }}
          mode={this.props.mode}
        />,
        this._modalConfirm()]);
      case 'gov_edit':
      case 'edit':
        return (<OrganizationEditForm
          fields={this.state.fields}
          handleInputChange={this._handleInputChange}
          referenceData={this.props.referenceData}
          handleSubmit={this._handleUpdate}
          mode={this.props.mode}
        />);
      default:
        return (<div />);
    }
  }
}

OrganizationEditContainer.defaultProps = {
  match: null,
  organization: null,
  referenceData: null
};

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
      status: PropTypes.number,
      type: PropTypes.number,
      actionsType: PropTypes.number
    }),
    isFetching: PropTypes.bool
  }),
  referenceData: PropTypes.shape({
    organizationTypes: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.number
    })),
    organizationActionsTypes: PropTypes.arrayOf(PropTypes.shape({
      the_type: PropTypes.string,
      id: PropTypes.number
    })),
    organizationStatuses: PropTypes.arrayOf(PropTypes.shape({
      status: PropTypes.string,
      id: PropTypes.number
    })),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }),
  updateOrganization: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  addOrganization: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'admin_edit']).isRequired
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
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  getOrganization: bindActionCreators(getOrganization, dispatch),
  updateOrganization: bindActionCreators(updateOrganization, dispatch),
  addOrganization: bindActionCreators(addOrganization, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationEditContainer);
