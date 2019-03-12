import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import Loading from '../../app/components/Loading';
import * as Lang from '../../constants/langEnUs';
import history from '../../app/History';
import PERMISSIONS_SECURE_DOCUMENT_UPLOAD from '../../constants/permissions/SecureDocumentUpload';
import SecureFileSubmissionTable from './SecureFileSubmissionTable';

const SecureFileSubmissionsPage = (props) => {
  const { isFetching, items } = props.documentUploads;
  const isEmpty = items.length === 0;

  return (
    <div className="page_secure_document_upload">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.DRAFT) &&
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
              {props.categories &&
                props.categories.map(category => (
                  (category.types.map(t => (
                    <li key={t.id}>
                      <button
                        onClick={() => {
                          const route = SECURE_DOCUMENT_UPLOAD.ADD.replace(':type', t.id);

                          history.push(route);
                        }}
                        type="button"
                      >
                        {t.description}
                      </button>
                    </li>
                  )))
                ))}
            </ul>
          </div>
          }
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <SecureFileSubmissionTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
        loggedInUser={props.loggedInUser}
      />
      }
    </div>
  );
};

SecureFileSubmissionsPage.defaultProps = {
};

SecureFileSubmissionsPage.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  documentUploads: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default SecureFileSubmissionsPage;
