/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import CREDIT_TRANSACTIONS from "../../constants/routes/CreditTransactions";
import {Link} from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import SECURE_DOCUMENT_UPLOAD from "../../constants/routes/SecureDocumentUpload";

const CreditTransferDocumentList = props => (
  <div className="credit-transfer-documents">
    <h3 className="documents-header" key="header">Linked Secure File Submissions</h3>
    <table>
      <thead>
      <tr>
        <th>Title</th>
        <th>Type</th>
        <th>Status</th>
        <th>Link</th>
      </tr>
      </thead>
      <tbody>
      {props.documents.map(document => (
        <tr key={document.id}>
          <td>{document.title}</td>
          <td>{document.type.theType}</td>
          <td>{document.status.status}</td>
          <td>
            <Link to={SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', document.id)}>
              <FontAwesomeIcon icon="box-open"/>
            </Link>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
);


CreditTransferDocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      type: PropTypes.shape,
      status: PropTypes.shape
    })
  ).isRequired
};

export default CreditTransferDocumentList;
