/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import getCompliancePeriods from '../../actions/compliancePeriodsActions';
import SecureFileSubmissionFormDetails from './SecureFileSubmissionFormDetails';
import Errors from '../../app/components/Errors';
import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import DOCUMENT_STATUSES from '../../constants/documentStatuses';

class SecureFileSubmissionForm extends Component {
  componentDidMount () {
    this.props.getCompliancePeriods();
  }

  render () {
    return (
      <div className="credit-transaction-requests">
        <h1>{this.props.edit ? 'Edit' : 'New'} {this.props.documentType ? this.props.documentType.description : ''} Submission</h1>
        <form
          onSubmit={(event, status) =>
            this.props.handleSubmit(event, DOCUMENT_STATUSES.draft)}
        >
          <SecureFileSubmissionFormDetails
            categories={this.props.categories}
            compliancePeriods={this.props.compliancePeriods}
            documentType={this.props.documentType}
            edit={this.props.edit}
            fields={this.props.fields}
            handleInputChange={this.props.handleInputChange}
          />

          {Object.keys(this.props.errors).length > 0 &&
            <Errors errors={this.props.errors} />
          }

          <div className="credit-transaction-requests-actions">
            <div className="btn-container">
              <button
                className="btn btn-default"
                onClick={() => history.goBack()}
                type="button"
              >
                <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
              </button>
              {this.props.availableActions.includes('Cancelled') &&
                <button
                  className="btn btn-danger"
                  data-target="#confirmDelete"
                  data-toggle="modal"
                  type="button"
                >
                  <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
                </button>
              }
              {this.props.availableActions.includes('Draft') &&
              <button
                className="btn btn-default"
                type="submit"
              >
                <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
              </button>
              }
              {this.props.availableActions.includes('Submitted') &&
              <TooltipWhenDisabled
                disabled={this.props.formValidationMessage.length > 0}
                title={this.props.formValidationMessage}
              >
                <button
                  className="btn btn-primary"
                  data-target="#confirmSubmit"
                  data-toggle="modal"
                  disabled={this.props.formValidationMessage.length > 0}
                  type="button"
                >
                  <FontAwesomeIcon icon="upload" /> {Lang.BTN_SUBMIT}
                </button>
              </TooltipWhenDisabled>
              }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

SecureFileSubmissionForm.defaultProps = {
  edit: false,
  formValidationMessage: ['Form is missing one or more required fields.'],
  id: 0
};

SecureFileSubmissionForm.propTypes = {
  availableActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  edit: PropTypes.bool,
  errors: PropTypes.shape({}).isRequired,
  documentType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      description: PropTypes.string,
      theType: PropTypes.string
    })
  ]).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string
  }).isRequired,
  formValidationMessage: PropTypes.arrayOf(PropTypes.string),
  getCompliancePeriods: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.number
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items
});

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SecureFileSubmissionForm);
