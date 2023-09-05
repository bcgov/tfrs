/*
 * Presentational component
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import getCompliancePeriods from '../../actions/compliancePeriodsActions'
import SecureFileSubmissionFormDetails from './SecureFileSubmissionFormDetails'
import Errors from '../../app/components/Errors'
import Tooltip from '../../app/components/Tooltip'
import * as Lang from '../../constants/langEnUs'
import DOCUMENT_STATUSES from '../../constants/documentStatuses'
import { useNavigate } from 'react-router'
import { transformDocumentTypeDescription } from '../../utils/functions'

const SecureFileSubmissionForm = props => {
  const navigate = useNavigate()

  useEffect(() => {
    props.getCompliancePeriods()
  }, [])

  return (
    <div className="credit-transaction-requests">
      <h1>{props.edit ? 'Edit' : 'New'} {props.documentType ? transformDocumentTypeDescription(props.documentType.description) : ''} Submission</h1>
      <form
        onSubmit={(event, status) =>
          props.handleSubmit(event, DOCUMENT_STATUSES.draft)}
      >
        <SecureFileSubmissionFormDetails
          categories={props.categories}
          compliancePeriods={props.compliancePeriods}
          documentType={props.documentType}
          edit={props.edit}
          fields={props.fields}
          handleInputChange={props.handleInputChange}
        />

        {Object.keys(props.errors).length > 0 &&
          <Errors errors={props.errors} />
        }

        <div className="credit-transaction-requests-actions">
          <div className="btn-container">
            <button
              className="btn btn-default"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
            </button>
            {props.availableActions.includes('Cancelled') &&
              <button
                className="btn btn-danger"
                data-target="#confirmDelete"
                data-toggle="modal"
                type="button"
              >
                <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
              </button>
            }
            {props.availableActions.includes('Draft') &&
            <button
              className="btn btn-default"
              type="submit"
            >
              <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
            </button>
            }
            {props.availableActions.includes('Submitted') &&
            <Tooltip
              show={props.formValidationMessage.length > 0}
              title={props.formValidationMessage}
            >
              <button
                className="btn btn-primary"
                data-target="#confirmSubmit"
                data-toggle="modal"
                disabled={props.formValidationMessage.length > 0}
                type="button"
              >
                <FontAwesomeIcon icon="upload" /> {Lang.BTN_SUBMIT}
              </button>
            </Tooltip>
            }
          </div>
        </div>
      </form>
    </div>
  )
}

SecureFileSubmissionForm.defaultProps = {
  edit: false,
  formValidationMessage: ['Form is missing one or more required fields.'],
  id: 0
}

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
}

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items
})

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecureFileSubmissionForm)
