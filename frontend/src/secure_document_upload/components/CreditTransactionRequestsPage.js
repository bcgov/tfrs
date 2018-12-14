import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import Loading from '../../app/components/Loading';
import * as Lang from '../../constants/langEnUs';
import history from '../../app/History';
import CreditTransferRequestTable from './CreditTransferRequestTable';

const CreditTransactionRequestsPage = (props) => {
  // const { isFetching, items } = props.creditTransfers;
  const isFetching = false;
  const isEmpty = false;
  const items = [];
  // const isEmpty = items.length === 0;

  return (
    <div className="page_secure_document_upload">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          <div className="btn-group">
            <button
              id="new-submission"
              className="btn btn-primary"
              onClick={() => {
                const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', '');

                history.push(route);
              }}
              type="button"
            >
              <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_SUBMISSION}
            </button>
            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="caret" />
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  onClick={() => {
                    const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', 'application');

                    history.push(route);
                  }}
                  type="button"
                >
                  Part 3 Award Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', 'evidence');

                    history.push(route);
                  }}
                  type="button"
                >
                  Part 3 Award Milestone Evidence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', 'records');

                    history.push(route);
                  }}
                  type="button"
                >
                  Fuel Supply Records
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', 'other');

                    history.push(route);
                  }}
                  type="button"
                >
                  Other
                </button>
              </li>
            </ul>
          </div>
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
  title: PropTypes.string.isRequired,
};

export default CreditTransactionRequestsPage;
