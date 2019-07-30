import { toastr as reduxToastr } from 'react-redux-toastr';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values';

const toastr = {
  complianceReporting: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    switch (status) {
      case 'Cancelled':
        reduxToastr.success('Success!', 'Draft deleted.');
        break;
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.');
        break;
      case 'Created':
        reduxToastr.success('Success!', 'New Compliance Report Created');
        break;
      default:
        reduxToastr.success('Success!', 'Compliance Report saved.');
    }
  },
  creditTransactionSuccess: (statusId, item, message = '') => {
    let text = 'Credit transaction';

    if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0 ||
        [CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type) >= 0) {
      text = 'Credit Transfer Proposal';
    }

    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    switch (statusId) {
      case CREDIT_TRANSFER_STATUS.accepted.id:
        reduxToastr.success('Success!', `${text} accepted.`);
        break;
      case CREDIT_TRANSFER_STATUS.approved.id:
        reduxToastr.success('Success!', `${text} approved.`);
        break;
      case CREDIT_TRANSFER_STATUS.deleted.id:
        reduxToastr.success('Success!', 'Draft deleted.');
        break;
      case CREDIT_TRANSFER_STATUS.draft.id:
        if (item.status === statusId || item.status.id === statusId) {
          reduxToastr.success('Success!', 'Draft saved.');
        } else {
          reduxToastr.success('Success!', `${text} sent back to draft.`);
        }
        break;
      case CREDIT_TRANSFER_STATUS.declinedForApproval.id:
        reduxToastr.success('Success!', `${text} declined.`);
        break;
      case CREDIT_TRANSFER_STATUS.notRecommended.id:
        reduxToastr.success('Success!', `${text} not recommended.`);
        break;
      case CREDIT_TRANSFER_STATUS.proposed.id:
        reduxToastr.success('Success!', `${text} sent.`);
        break;
      case CREDIT_TRANSFER_STATUS.recommendedForDecision.id:
        reduxToastr.success('Success!', `${text} recommended.`);
        break;
      case CREDIT_TRANSFER_STATUS.refused.id:
        reduxToastr.success('Success!', `${text} refused.`);
        break;
      case CREDIT_TRANSFER_STATUS.rescinded.id:
        reduxToastr.success('Success!', `${text} rescinded.`);
        break;
      default:
        reduxToastr.success('Success!', `${text} saved.`);
    }
  },
  documentUpload: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    switch (status) {
      case 'Archived':
        reduxToastr.success('Success!', 'File archived.');
        break;
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.');
        break;
      case 'Received':
        reduxToastr.success('Success!', 'File received.');
        break;
      case 'Submitted':
        reduxToastr.success('Success!', 'File submitted.');
        break;
      default:
        reduxToastr.success('Success!', 'File uploaded.');
    }
  },
  fuelCodeSuccess: (status, message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    switch (status) {
      case 'Cancelled':
        reduxToastr.success('Success!', 'Draft deleted.');
        break;
      case 'Draft':
        reduxToastr.success('Success!', 'Draft saved.');
        break;
      case 'Approved':
        reduxToastr.success('Success!', 'Fuel code added.');
        break;
      default:
        reduxToastr.success('Success!', 'Fuel code saved.');
    }
  },
  subscriptionsSuccess: (message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    reduxToastr.success('Success!', 'Notifications updated.');
  },
  userSuccess: (message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    reduxToastr.success('Success!', 'User updated.');
  },
  organizationSuccess: (message = '') => {
    if (message !== '') { // message is only used to override
      reduxToastr.success('Success!', message);
      return;
    }

    reduxToastr.success('Success!', 'Organization updated.');
  }
};

export default toastr;
