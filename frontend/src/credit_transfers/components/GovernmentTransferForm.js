/*
 * Presentational component
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import getCompliancePeriods from '../../actions/compliancePeriodsActions'
import Errors from '../../app/components/Errors'
import Tooltip from '../../app/components/Tooltip'
import * as Lang from '../../constants/langEnUs'
import { CREDIT_TRANSFER_STATUS } from '../../constants/values'
import CreditTransferCommentButtons from './CreditTransferCommentButtons'
import CreditTransferCommentForm from './CreditTransferCommentForm'
import GovernmentTransferFormDetails from './GovernmentTransferFormDetails'
import { useNavigate } from 'react-router'

const GovernmentTransferForm = props => {
  const navigate = useNavigate()

  useEffect(() => {
    props.getCompliancePeriods()
  }, [])

  return (
    <div className="credit-transaction pvr">
      <h1>{props.title}</h1>
      <form
        onSubmit={(event, status) =>
          props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
      >
        <GovernmentTransferFormDetails
          compliancePeriods={props.compliancePeriods}
          fuelSuppliers={props.fuelSuppliers}
          fields={props.fields}
          handleInputChange={props.handleInputChange}
        >
          <CreditTransferCommentButtons
            canComment={props.canComment}
            isCommenting={false}
            addComment={props.addComment}
            canCreatePrivilegedComment={props.canCreatePrivilegedComment}
          />
          <CreditTransferCommentForm
            comment={props.fields.comment}
            isCommentingOnUnsavedCreditTransfer={props.id === 0}
            isCreatingPrivilegedComment={props.isCreatingPrivilegedComment}
            isEditingExistingComment={props.fields.comment.length > 0}
            handleCommentChanged={props.handleCommentChanged}
            embedded
          />
        </GovernmentTransferFormDetails>

        {Object.keys(props.errors).length > 0 &&
          <Errors errors={props.errors} />
        }

        {Object.keys(props.validationErrors).length > 0 &&
          <Errors errors={props.validationErrors} />
        }

        <div className="credit-transfer-actions">
          <div className="btn-container">
            <button
              className="btn btn-default"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
            </button>
            {props.actions.includes(Lang.BTN_DELETE_DRAFT) &&
            <button
              className="btn btn-danger"
              data-target="#confirmDelete"
              data-toggle="modal"
              type="button"
            >
              <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
            </button>
            }
            {props.actions.includes(Lang.BTN_SAVE_DRAFT) &&
            <button
              className="btn btn-default"
              type="submit"
            >
              <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
            </button>
            }
            {props.actions.includes(Lang.BTN_RECOMMEND_FOR_DECISION) &&
            <Tooltip
              show={props.fields.comment.length === 0}
              title={Lang.TEXT_COMMENT_REQUIRED}
            >
              <button
                className={`btn ${props.fields.comment.length === 0
                  ? 'btn-disabled'
: 'btn-primary '}`}
                data-target="#confirmRecommend"
                data-toggle="modal"
                disabled={props.fields.comment.length === 0}
                type="button"
              >
                {Lang.BTN_RECOMMEND_FOR_DECISION}
              </button>
            </Tooltip>
            }
          </div>
        </div>
      </form>
    </div>
  )
}

GovernmentTransferForm.defaultProps = {
  handleCommentChanged: null,
  id: 0,
  title: 'New Credit Transaction',
  validationErrors: {}
}

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
  title: PropTypes.string,
  validationErrors: PropTypes.shape({})
}

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items
})

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(GovernmentTransferForm)
