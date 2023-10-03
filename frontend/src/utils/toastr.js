import { toastr as reduxToastr } from 'react-redux-toastr'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values'

const toastr = {
  complianceReporting: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    switch (status) {
      case 'Supplemental Created':
        reduxToastr.success('Success!', 'Supplemental report created.')
        break
      case 'Accepted':
        reduxToastr.success('Success!', 'Compliance Report accepted.')
        break
      case 'Cancelled':
        reduxToastr.success('Success!', 'Draft deleted.')
        break
      case 'Created':
        reduxToastr.success('Success!', 'New Compliance Report created')
        break
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.')
        break
      case 'Not Recommended':
        reduxToastr.success('Success!', 'Rejection recommended.')
        break
      case 'Recommended':
        reduxToastr.success('Success!', 'Acceptance recommended.')
        break
      case 'Rejected':
        reduxToastr.success('Success!', 'Compliance Report rejected.')
        break
      case 'Requested Supplemental':
        reduxToastr.success('Success!', 'Supplemental Requested.')
        break
      case 'Submitted':
        reduxToastr.success('Success!', 'Compliance Report submitted.')
        break
      default:
        reduxToastr.success('Success!', 'Compliance Report saved.')
    }
  },
  creditTransactionSuccess: (statusId, item, message = '') => {
    let text = 'Credit transaction'
    let newActText = 'Issuance'

    if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0 ||
        [CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type) >= 0) {
      text = 'Transfer'
    }

    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    switch (statusId) {
      case CREDIT_TRANSFER_STATUS.accepted.id:
        reduxToastr.success('Success!', `${text} signed and submitted.`)
        break
      case CREDIT_TRANSFER_STATUS.approved.id:
        reduxToastr.success('Success!', `${newActText} approved.`)
        break
      case CREDIT_TRANSFER_STATUS.deleted.id:
        reduxToastr.success('Success!', 'Draft deleted.')
        break
      case CREDIT_TRANSFER_STATUS.draft.id:
        if (item.status === statusId || item.status.id === statusId) {
          reduxToastr.success('Success!', 'Draft saved.')
        } else {
          reduxToastr.success('Success!', `${text} sent back to draft.`)
        }
        break
      case CREDIT_TRANSFER_STATUS.declinedForApproval.id:
        reduxToastr.success('Success!', `${newActText} declined.`)
        break
      case CREDIT_TRANSFER_STATUS.notRecommended.id:
        reduxToastr.success('Success!', `${text} not recommended.`)
        break
      case CREDIT_TRANSFER_STATUS.proposed.id:
        reduxToastr.success('Success!', `${text} signed and sent.`)
        break
      case CREDIT_TRANSFER_STATUS.recommendedForDecision.id:
        reduxToastr.success('Success!', `${text} recommended.`)
        break
      case CREDIT_TRANSFER_STATUS.refused.id:
        reduxToastr.success('Success!', `${text} declined.`)
        break
      case CREDIT_TRANSFER_STATUS.rescinded.id:
        reduxToastr.success('Success!', `${text} rescinded.`)
        break
      default:
        reduxToastr.success('Success!', `${text} saved.`)
    }
  },
  documentUpload: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    switch (status) {
      case 'Archived':
        reduxToastr.success('Success!', 'File archived.')
        break
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.')
        break
      case 'Received':
        reduxToastr.success('Success!', 'File received.')
        break
      case 'Submitted':
        reduxToastr.success('Success!', 'File submitted.')
        break
      default:
        reduxToastr.success('Success!', 'File uploaded.')
    }
  },
  exclusionReports: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    switch (status) {
      case 'Accepted':
        reduxToastr.success('Success!', 'Exclusion Report accepted.')
        break
      case 'Cancelled':
        reduxToastr.success('Success!', 'Draft deleted.')
        break
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.')
        break
      case 'Created':
        reduxToastr.success('Success!', 'New Exclusion Report created')
        break
      case 'Not Recommended':
        reduxToastr.success('Success!', 'Rejection recommended.')
        break
      case 'Recommended':
        reduxToastr.success('Success!', 'Acceptance recommended.')
        break
      case 'Rejected':
        reduxToastr.success('Success!', 'Exclusion Report rejected.')
        break
      case 'Requested Supplemental':
        reduxToastr.success('Success!', 'Supplemental Requested.')
        break
      case 'Submitted':
        reduxToastr.success('Success!', 'Exclusion Report submitted.')
        break
      case 'Supplemental Created':
        reduxToastr.success('Success!', 'Supplemental report created.')
        break
      default:
        reduxToastr.success('Success!', 'Exclusion Report saved.')
    }
  },
  fuelCodeSuccess: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    switch (status) {
      case 'Cancelled':
        reduxToastr.success('Success!', 'Draft deleted.')
        break
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.')
        break
      case 'Approved':
        reduxToastr.success('Success!', 'Fuel code added.')
        break
      default:
        reduxToastr.success('Success!', 'Fuel code saved.')
    }
  },
  subscriptionsSuccess: (message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    reduxToastr.success('Success!', 'Notifications updated.')
  },
  userSuccess: (message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    reduxToastr.success('Success!', 'User updated.')
  },
  organizationSuccess: (message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message)
      return
    }

    reduxToastr.success('Success!', 'Organization updated.')
  }
}

export default toastr
