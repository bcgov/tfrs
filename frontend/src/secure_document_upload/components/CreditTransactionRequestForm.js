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
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

class CreditTransactionRequestForm extends Component {
  componentDidMount () {
    this.props.getCompliancePeriods();
  }

  render () {
    return (
      <div className="credit-transaction pvr">
        <h1>{this.props.title}</h1>
        <form
          onSubmit={(event, status) =>
            this.props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
        >
          <CreditTransactionRequestFormDetails
            compliancePeriods={this.props.compliancePeriods}
            fields={this.props.fields}
            handleInputChange={this.props.handleInputChange}
          />

          {Object.keys(this.props.errors).length > 0 &&
            <Errors errors={this.props.errors} />
          }

          <div className="credit-transfer-actions">
            <div className="btn-container">
              <button
                className="btn btn-default"
                onClick={() => history.goBack()}
                type="button"
              >
                <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
              </button>
              <button
                className="btn btn-danger"
                data-target="#confirmDelete"
                data-toggle="modal"
                type="button"
              >
                <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
              </button>
              <button
                className="btn btn-default"
                type="submit"
              >
                <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

CreditTransactionRequestForm.defaultProps = {
  id: 0,
  title: 'New Credit Transaction Request'
};

CreditTransactionRequestForm.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string
  }).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
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
