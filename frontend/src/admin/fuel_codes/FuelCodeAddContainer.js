/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal as PrepoluateModal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addFuelCode, getLatestFuelCode } from '../../actions/fuelCodeActions';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import Modal from '../../app/components/Modal';
import FuelCodeForm from './components/FuelCodeForm';
import * as Lang from '../../constants/langEnUs';
import { FUEL_CODES } from '../../constants/routes/Admin';
import toastr from '../../utils/toastr';

class FuelCodeAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        applicationDate: '',
        approvalDate: '',
        carbonIntensity: '',
        company: '',
        effectiveDate: '',
        expiryDate: '',
        facilityLocation: '',
        facilityNameplate: '',
        feedstock: '',
        feedstockLocation: '',
        feedstockMisc: '',
        feedstockTransportMode: [],
        formerCompany: '',
        fuel: '',
        fuelCode: '',
        fuelTransportMode: [],
        renewablePercentage: ''
      },
      showModal: false
    };

    this._addToFields = this._addToFields.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._getFuelCodeStatus = this._getFuelCodeStatus.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._openModal = this._openModal.bind(this);
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    const found = this.state.fields.terms.find(term => term.id === value.id);

    if (!found) {
      fieldState.terms.push(value);
    }

    this.setState({
      fields: fieldState
    });
  }

  _closeModal () {
    this.setState({
      showModal: false
    });
  }

  _getFuelCodeStatus (status) {
    return this.props.referenceData.fuelCodeStatuses.find(fuelCodeStatus =>
      (fuelCodeStatus.status === status));
  }

  _handleInputChange (event) {
    const { name } = event.target;
    let { value } = event.target;

    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      fieldState[name] = [...event.target.options].filter(o => o.selected).map(o => o.value);
      this.setState({
        fields: fieldState
      });
    } else {
      if (name === 'facilityNameplate') {
        // as you're typing remove non-numeric values
        // (this is so we don't mess our count, but we'll add commas later)
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }

      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status = 'Draft') {
    event.preventDefault();

    const fuelCode = this.state.fields.fuelCode.split('.');

    // API data structure
    const data = {
      applicationDate: this.state.fields.applicationDate !== '' ? this.state.fields.applicationDate : null,
      approvalDate: this.state.fields.approvalDate !== '' ? this.state.fields.approvalDate : null,
      carbonIntensity: this.state.fields.carbonIntensity,
      company: this.state.fields.company,
      effectiveDate: this.state.fields.effectiveDate !== '' ? this.state.fields.effectiveDate : null,
      expiryDate: this.state.fields.expiryDate !== '' ? this.state.fields.expiryDate : null,
      facilityLocation: this.state.fields.facilityLocation,
      facilityNameplate: this.state.fields.facilityNameplate !== '' ? this.state.fields.facilityNameplate.replace(/\D/g, '') : null,
      feedstock: this.state.fields.feedstock,
      feedstockLocation: this.state.fields.feedstockLocation,
      feedstockMisc: this.state.fields.feedstockMisc,
      feedstockTransportMode: this.state.fields.feedstockTransportMode,
      formerCompany: this.state.fields.formerCompany,
      fuel: this.state.fields.fuel,
      fuelCode: 'BCLCF',
      fuelCodeVersion: fuelCode.length > 0 ? fuelCode[0] : null,
      fuelCodeVersionMinor: fuelCode.length > 1 ? fuelCode[1] : null,
      fuelTransportMode: this.state.fields.fuelTransportMode,
      renewablePercentage: (this.state.fields.renewablePercentage !== '') ? this.state.fields.renewablePercentage : null,
      status: this._getFuelCodeStatus(status).id
    };

    Object.entries(data).forEach((prop) => {
      if (prop[1] === null) {
        delete data[prop[0]];
      }
    });

    this.props.addFuelCode(data).then((response) => {
      history.push(FUEL_CODES.LIST);
      toastr.fuelCodeSuccess(status);
    });

    return true;
  }

  _openModal () {
    this.setState({
      showModal: true
    });
  }

  render () {
    if (this.props.referenceData.isFetching ||
      !this.props.referenceData.isSuccessful) {
      return (<Loading />);
    }

    return ([
      <FuelCodeForm
        addToFields={this._addToFields}
        approvedFuels={this.props.referenceData.approvedFuels}
        errors={this.props.errors}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSelect={this._openModal}
        handleSubmit={this._handleSubmit}
        key="form"
        title="New Fuel Code"
        transportModes={this.props.referenceData.transportModes}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event, 'Approved')}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this Fuel code?
      </Modal>,
      <PrepoluateModal
        show={this.state.showModal}
        id="confirmPrepopulate"
        key="confirmPrepopulate"
      >
        <PrepoluateModal.Header className="modal-header">
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={this._closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <PrepoluateModal.Title className="modal-title">
          Confirmation
          </PrepoluateModal.Title>
        </PrepoluateModal.Header>
        <PrepoluateModal.Body className="modal-body">
          {!this.props.fuelCode.isFetching &&
            <div>
              Would you like to pre-populate the values in the form based on the previous
              version&apos;s information?
            </div>
          }
          {this.props.fuelCode.isFetching && <Loading />}
        </PrepoluateModal.Body>
        <PrepoluateModal.Footer className="modal-footer">
          <button
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this._closeModal}
            type="button"
          >
            {Lang.BTN_NO}
          </button>
          <button
            className="btn btn-primary"
            data-dismiss="modal"
            id="modal-yes"
            onClick={() => {
              const fuelCode = this.state.fields.fuelCode.split('.');

              if (fuelCode.length > 0) {
                this.props.getFuelCode({
                  fuel_code: 'BCLCF',
                  fuel_code_version: fuelCode[0]
                }).then(() => {
                  const { item } = this.props.fuelCode;
                  const fieldState = { ...this.state.fields };

                  Object.entries(item).forEach((prop) => {
                    if ([
                      'company', 'facilityLocation', 'facilityNameplate', 'feedstock',
                      'feedstockLocation', 'feedstockMisc', 'feedstockTransportMode',
                      'fuel', 'fuelTransportMode'
                    ].includes(prop[0])) {
                      const name = prop[0];
                      let value = prop[1];

                      if (name === 'facilityNameplate') {
                        value = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                      }

                      fieldState[name] = value;
                    }
                  });

                  this.setState({
                    fields: fieldState
                  });

                  this._closeModal();
                });
              } else {
                this._closeModal();
              }
            }}
            type="button"
          >
            {Lang.BTN_YES}
          </button>
        </PrepoluateModal.Footer>
      </PrepoluateModal>
    ]);
  }
}

FuelCodeAddContainer.defaultProps = {
  errors: {}
};

FuelCodeAddContainer.propTypes = {
  addFuelCode: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  fuelCode: PropTypes.shape({
    errors: PropTypes.shape(),
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number
    }),
    success: PropTypes.bool
  }).isRequired,
  getFuelCode: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
  referenceData: PropTypes.shape({
    fuelCodeStatuses: PropTypes.arrayOf(PropTypes.shape),
    approvedFuels: PropTypes.arrayOf(PropTypes.shape),
    transportModes: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.fuelCode.errors,
  fuelCode: {
    errors: state.rootReducer.fuelCode.errors,
    isFetching: state.rootReducer.fuelCode.isFetching,
    item: state.rootReducer.fuelCode.item,
    success: state.rootReducer.fuelCode.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    fuelCodeStatuses: state.rootReducer.referenceData.data.fuelCodeStatuses,
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels,
    transportModes: state.rootReducer.referenceData.data.transportModes,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  addFuelCode: bindActionCreators(addFuelCode, dispatch),
  getFuelCode: bindActionCreators(getLatestFuelCode, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelCodeAddContainer);
