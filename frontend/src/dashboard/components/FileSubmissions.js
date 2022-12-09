import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../../app/components/Loading'
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload'
import { useNavigate } from 'react-router'

const FileSubmissions = (props) => {
  const { isFetching, items, itemsCount } = props.documentUploads
  const navigate = useNavigate()

  if (isFetching) {
    return <Loading />
  }

  const awaitingReview = {
    documentUploads: {
      received: 0,
      submitted: 0,
      total: 0
    }
  }
  items.forEach((item) => {
    if (item.status.status === 'Submitted') {
      awaitingReview.documentUploads.submitted += 1
      awaitingReview.documentUploads.total += 1
    }

    if (item.status.status === 'Received') {
      awaitingReview.documentUploads.received += 1
      awaitingReview.documentUploads.total += 1
    }
  })
  
  return (
    <div className="dashboard-fieldset">
      <h1>File Submissions</h1>
      There are:

      <div>
        <div className="value">
          {awaitingReview.documentUploads.total}
        </div>
        <div className="content">
          <h2>file submissions in progress:</h2>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'status',
                  value: 'Submitted'
                }], 'sfs')

                return navigate(SECURE_DOCUMENT_UPLOAD.LIST)
              }}
              type="button"
            >
              {`${awaitingReview.documentUploads.submitted} `}
              awaiting to be marked as received
            </button>
          </div>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'status',
                  value: 'Received'
                }], 'sfs')

                return navigate(SECURE_DOCUMENT_UPLOAD.LIST)
              }}
              type="button"
            >
              {awaitingReview.documentUploads.received} awaiting review and archive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

FileSubmissions.defaultProps = {
}

FileSubmissions.propTypes = {
  documentUploads: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
}

export default FileSubmissions
