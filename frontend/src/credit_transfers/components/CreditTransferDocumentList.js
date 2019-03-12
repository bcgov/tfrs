/*
 * Presentational component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';

const CreditTransferDocumentList = props => (
  <div className="credit-transfer-documents">
    <h3 className="documents-header" key="header">Linked Secure File Submissions</h3>
    <div className="linked-file-submissions">
      <div className="row">
        <div className="col-xs-3 header">ID</div>
        <div className="col-xs-3 header">Title</div>
        <div className="col-xs-3 header">Type</div>
        <div className="col-xs-3 status header">Status</div>
      </div>
      {props.documents.map(document => (
        <div className="row" key={document.id}>
          <div className="col-xs-3">
            <Link to={SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', document.id)}>
              {document.id}
            </Link>
          </div>
          <div className="col-xs-3">{document.title}</div>
          <div className="col-xs-3">{document.type.theType}</div>
          <div className="col-xs-3 status">{document.status.status}</div>
        </div>
      ))}
    </div>
  </div>
);

CreditTransferDocumentList.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    type: PropTypes.shape,
    status: PropTypes.shape
  })).isRequired
};

export default CreditTransferDocumentList;
