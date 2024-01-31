import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ORGANIZATIONS from '../../constants/routes/Organizations'
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload'

const Part3Agreements = props => {
  const navigate = useNavigate()
  return (
    <div className="dashboard-fieldset part-3-agreements">
      <h1>Part 3 Agreements</h1>

      <div>
        <div className="content">
          <Link to={SECURE_DOCUMENT_UPLOAD.LIST}>Part 3 Agreements</Link>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <a
            href={ORGANIZATIONS.PART_3}
            rel="noopener noreferrer"
            target="_blank"
          >
            Part 3 Agreement application information
          </a>
          <a
            href={ORGANIZATIONS.PART_3}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon="external-link-alt" />
          </a>
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
              const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', '')

              return navigate(route)
            }}
            type="button"
          >
            Submit/Upload a file securely
          </button>
          <br/>
          {' for Part 3 Agreement applications or milestone evidence for Part 3 Awards'}
        </div>
        <p><br /></p>
      </div>
    </div>
  )
}

Part3Agreements.defaultProps = {
}

Part3Agreements.propTypes = {
}

export default Part3Agreements
