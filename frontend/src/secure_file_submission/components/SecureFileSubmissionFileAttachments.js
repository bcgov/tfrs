/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import axios from 'axios'

import { getFileSize, getIcon, getScanStatusIcon } from '../../utils/functions'

const SecureFileSubmissionFileAttachments = props => (
  <div className={`file-submission-attachments hide-security-scan ${
    ((props.status.status === 'Received' && props.availableActions.includes('Archived')) ||
    props.status.status === 'Archived')
? ''
: 'hide-trim'}`
  }
  >
    <div className="row">
      <div className="col-xs-6 header">Filename</div>
      <div className="col-xs-3 size header">Size</div>
      <div className="col-xs-3 security-scan-status header">Security Scan</div>
      <div className="col-xs-3 trim-record-number header">TRIM Record #</div>
    </div>
    {props.attachments.map((attachment, index) => (
      <div className="row" key={attachment.url}>
        <div className="col-xs-6 filename">
          <span className="icon">
            <FontAwesomeIcon icon={getIcon(attachment.mimeType)} fixedWidth />
          </span>
          <button
            className="text"
            onClick={() => {
              axios.get(attachment.url, {
                transformRequest: (data, headers) => {
                  headers.Authorization = null
                },
                responseType: 'blob'
              }).then((response) => {
                const objectURL =
                  window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = objectURL
                link.setAttribute('download', attachment.filename)
                document.body.appendChild(link)
                link.click()
              })
            }}
            type="button"
          >
            {attachment.filename}
          </button>
        </div>

        <div className="col-xs-3 size">
          <span>{getFileSize(attachment.size)}</span>
        </div>

        <div className="col-xs-3 security-scan-status">
          <span className="security-scan-icon" data-security-scan-status={attachment.securityScanStatus}>
            <FontAwesomeIcon
              icon={getScanStatusIcon(attachment.securityScanStatus)}
              fixedWidth
            />
          </span>
        </div>

        <div className="col-xs-3 trim-record-number">
          {props.status.status === 'Received' &&
          <input
            className="form-control"
            id={`record-number-${index}`}
            name="recordNumbers"
            onChange={(event) => {
              props.handleRecordNumberChange(event, index, attachment.id)
            }}
            required="required"
            type="text"
            value={props.fields.recordNumbers[index] ? props.fields.recordNumbers[index].value : ''}
          />
          }
          {props.status.status === 'Archived' &&
          <span>{attachment.recordNumber}</span>
          }
        </div>
      </div>
    ))}
    {props.attachments.length === 0 &&
    <div className="row">
      <div className="col-xs-12">No files attached.</div>
    </div>
    }
  </div>
)

SecureFileSubmissionFileAttachments.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  availableActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  fields: PropTypes.shape({
    recordNumbers: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  status: PropTypes.shape().isRequired,
  handleRecordNumberChange: PropTypes.func.isRequired
}

export default SecureFileSubmissionFileAttachments
