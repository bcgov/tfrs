/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

import getCompliancePeriods from '../../actions/compliancePeriodsActions';
import Errors from '../../app/components/Errors';
import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';
import GovernmentTransferFormDetails from './GovernmentTransferFormDetails';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';

class GovernmentTransferForm extends Component {
  componentDidMount () {
    this.props.getCompliancePeriods();
  }

  render () {
    return (
      <div className="credit-transaction">
        <h1>{this.props.title}</h1>
        <form
          onSubmit={(event, status) =>
            this.props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
        >
          <GovernmentTransferFormDetails
            compliancePeriods={this.props.compliancePeriods}
            fuelSuppliers={this.props.fuelSuppliers}
            fields={this.props.fields}
            handleInputChange={this.props.handleInputChange}
          />

          {Object.keys(this.props.errors).length > 0 &&
            <Errors errors={this.props.errors} />
          }

          <div className="btn-container">
            <button
              className="btn btn-default"
              onClick={() => history.goBack()}
              type="button"
            >
              {Lang.BTN_APP_CANCEL}
            </button>
            <button
              className="btn btn-default"
              type="submit"
            >
              {Lang.BTN_SAVE_DRAFT}
            </button>
            <TooltipWhenDisabled
              disabled={this.props.fields.comment.length === 0}
              title={Lang.TEXT_COMMENT_REQUIRED}
            >
              <button
                className={`btn ${this.props.fields.comment.length === 0
                  ? 'btn-disabled' : 'btn-primary '}`}
                data-target="#confirmRecommend"
                data-toggle="modal"
                disabled={this.props.fields.comment.length === 0}
                type="button"
              >
                {Lang.BTN_RECOMMEND_FOR_DECISION}
              </button>
            </TooltipWhenDisabled>
          </div>
        </form>
      </div>
    );
  }
}

GovernmentTransferForm.defaultProps = {
  id: 0,
  title: 'New Credit Transaction'
};

GovernmentTransferForm.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(GovernmentTransferForm);
