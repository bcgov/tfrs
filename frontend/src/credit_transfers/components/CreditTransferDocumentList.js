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
        <div className="col-xs-1 header">ID</div>
        <div className="col-xs-5 title header">Title</div>
        <div className="col-xs-4 type header">Type</div>
        <div className="col-xs-2 status header">Status</div>
      </div>
      {props.documents.map(document => (
        <div className="row" key={document.id}>
          <div className="col-xs-1">
            <Link to={SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', document.id)}>
              {document.id}
            </Link>
          </div>
          <div className="col-xs-5 title"><span className="value">{document.title}</span></div>
          <div className="col-xs-4 type"><span className="value">{document.type.description}</span></div>
          <div className="col-xs-2 status">{document.status.status}</div>
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
