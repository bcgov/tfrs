import { toastr as reduxToastr } from 'react-redux-toastr';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values';

const toastr = {
  creditTransactionSuccess: (statusId, item) => {
    let text = 'Credit Transaction';

    if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id]
      .indexOf(item.type.id) >= 0) {
      text = 'Credit Transfer proposal';
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
      case CREDIT_TRANSFER_STATUS.proposed.id:
        reduxToastr.success('Success!', `${text} submitted.`);
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
  }
};

export default toastr;
