import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import Loading from '../../app/components/Loading';
import history from '../../app/History';
import CreditTransferRequestTable from './CreditTransferRequestTable';

const CreditTransactionRequestsPage = (props) => {
  // const { isFetching, items } = props.creditTransfers;
  const isFetching = false;
  const isEmpty = false;
  const items = [];
  // const isEmpty = items.length === 0;

  return (
    <div className="page_credit_transaction_requests">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          <button
            id="credit-transfer-new-transfer"
            className="btn btn-primary"
            onClick={() => history.push(SECURE_DOCUMENT_UPLOAD.ADD)}
            type="button"
          >
            <FontAwesomeIcon icon="plus-circle" /> New Request
          </button>
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <CreditTransferRequestTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
    </div>
  );
};

CreditTransactionRequestsPage.defaultProps = {
};

CreditTransactionRequestsPage.propTypes = {
  title: PropTypes.string.isRequired
};

export default CreditTransactionRequestsPage;
