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
import CreditTransferCommentButtons from './CreditTransferCommentButtons';
import CreditTransferCommentForm from './CreditTransferCommentForm';

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
          >
            <CreditTransferCommentButtons
              canComment={this.props.canComment}
              isCommenting={false}
              addComment={this.props.addComment}
              canCreatePrivilegedComment={this.props.canCreatePrivilegedComment}
            />
            <CreditTransferCommentForm
              comment={this.props.fields.comment}
              isCommentingOnUnsavedCreditTransfer={this.props.id === 0}
              isCreatingPrivilegedComment={this.props.isCreatingPrivilegedComment}
              isEditingExistingComment={this.props.fields.comment.length > 0}
              handleCommentChanged={this.props.handleCommentChanged}
              embedded
            />
          </GovernmentTransferFormDetails>

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
                {Lang.BTN_APP_CANCEL}
              </button>
              {this.props.actions.includes(Lang.BTN_DELETE_DRAFT) &&
              <button
                className="btn btn-danger"
                data-target="#confirmDelete"
                data-toggle="modal"
                type="button"
              >
                {Lang.BTN_DELETE_DRAFT}
              </button>
              }
              {this.props.actions.includes(Lang.BTN_SAVE_DRAFT) &&
              <button
                className="btn btn-default"
                type="submit"
              >
                {Lang.BTN_SAVE_DRAFT}
              </button>
              }
              {this.props.actions.includes(Lang.BTN_RECOMMEND_FOR_DECISION) &&
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
              }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

GovernmentTransferForm.defaultProps = {
  handleCommentChanged: null,
  id: 0,
  title: 'New Credit Transaction'
};

GovernmentTransferForm.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  addComment: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired,
  canCreatePrivilegedComment: PropTypes.bool.isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  handleCommentChanged: PropTypes.func,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.number,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  isCommenting: PropTypes.bool.isRequired,
  title: PropTypes.string
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items
});

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GovernmentTransferForm);
