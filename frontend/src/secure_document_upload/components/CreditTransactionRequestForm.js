/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import getCompliancePeriods from '../../actions/compliancePeriodsActions';
import CreditTransactionRequestFormDetails from './CreditTransactionRequestFormDetails';
import Errors from '../../app/components/Errors';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import DOCUMENT_STATUSES from '../../constants/documentStatuses';

class CreditTransactionRequestForm extends Component {
  componentDidMount () {
    this.props.getCompliancePeriods();
  }

  render () {
    return (
      <div className="credit-transaction-requests">
        <h1>{this.props.title}</h1>
        <form
          onSubmit={(event, status) =>
            this.props.handleSubmit(event, DOCUMENT_STATUSES.draft)}
        >
          <CreditTransactionRequestFormDetails
            categories={this.props.categories}
            compliancePeriods={this.props.compliancePeriods}
            fields={this.props.fields}
            handleInputChange={this.props.handleInputChange}
            handlePageTitle={this.props.handlePageTitle}
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
              {this.props.edit &&
                <button
                  className="btn btn-danger"
                  data-target="#confirmDelete"
                  data-toggle="modal"
                  type="button"
                >
                  <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
                </button>
              }
              <button
                className="btn btn-default"
                type="submit"
              >
                <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
              </button>
              <button
                className="btn btn-primary"
                data-target="#confirmSubmit"
                data-toggle="modal"
                type="button"
              >
                <FontAwesomeIcon icon="upload" /> Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

CreditTransactionRequestForm.defaultProps = {
  edit: false,
  handlePageTitle: () => {},
  id: 0,
  title: 'New Credit Transaction Request'
};

CreditTransactionRequestForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  edit: PropTypes.bool,
  errors: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string
  }).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePageTitle: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.number,
  title: PropTypes.string
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items
});

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestForm);
