import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload'

const FileSubmission = props => {
  const navigate = useNavigate()
  return (
    <div className="dashboard-fieldset part-3-agreements">
      <h1>File Submission</h1>

      <div>
        <div className="content">
          <Link to={SECURE_DOCUMENT_UPLOAD.LIST}>File submission</Link>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="icon">
          <FontAwesomeIcon icon="lock" className="icon-secure" />
          <FontAwesomeIcon icon="upload" className="icon-upload" />
        </div>
        <div className="content">
          <button
            onClick={() => {
              const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', '2')

              return navigate(route)
            }}
            type="button"
          >
            Submit/upload files
          </button>
          <br/>
          {' related to initiative agreements, compliance reporting, transfers, initiative plans.'}
        </div>
        <p><br /></p>
      </div>
    </div>
  )
}

FileSubmission.defaultProps = {
}

FileSubmission.propTypes = {
}

export default FileSubmission
