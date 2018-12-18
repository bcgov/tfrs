/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import axios from 'axios';

import * as Routes from '../../constants/routes';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import { download } from '../../utils/functions';

const CreditTransactionRequestDetails = props => (
  <div className="credit-transaction-request-details">
    <div className="row">
      <div className="col-md-6">
        <div className="row">
          <div className="form-group col-md-12">
            <label htmlFor="attachment-category">Attachment Category:
            </label>
          </div>
        </div>

        <div className="row main-form">
          <div className="form-group col-md-12">
            <label htmlFor="compliance-period">Compliance Period:
              <div className="value">{props.item.compliancePeriod.description}</div>
            </label>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="milestone-id">Milestone:
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="agreement-name">Part 3 Agreement Name:
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="comment">Comment:
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="row main-form">
          <div className="form-group col-md-12">
            <label htmlFor="document-type">Attachment Type:
            </label>
          </div>
        </div>

        <div className="row main-form">
          <div className="form-group col-md-12">
            <label htmlFor="comment">Attachments:
            </label>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-12 main-form files">
            <div>Files:
              <ul>
                {props.item.attachments.map(attachment => (
                  <li key={attachment.name}>
                    {attachment.filename} - {attachment.size} bytes
                    <button
                      type="button"
                      onClick={() => {
                        axios.get(attachment.url, {
                          responseType: 'blob'
                        }).then((response) => {
                          const objectURL = window.URL.createObjectURL(new Blob([response.data]));
                          const link = document.createElement('a');
                          link.href = objectURL;
                          link.setAttribute('download', attachment.filename);
                          document.body.appendChild(link);
                          link.click();
                        });
                      }}
                    >
                      <FontAwesomeIcon icon="file-download" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CreditTransactionRequestDetails.defaultProps = {
};

CreditTransactionRequestDetails.propTypes = {
  item: PropTypes.shape().isRequired
};

export default CreditTransactionRequestDetails;
