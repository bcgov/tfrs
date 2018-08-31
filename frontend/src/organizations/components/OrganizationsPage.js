import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Loading from '../../app/components/Loading';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import OrganizationsTable from './OrganizationsTable';

const OrganizationsPage = (props) => {
  const { isFetching, items } = props.organizations;
  const isEmpty = items.length === 0;
  return (
    <div className="page_organizations">
      <h1>{props.title}</h1>
      <div className="actions-container">
        <button
          className="btn btn-success"
          type="button"
          onClick={() => (document.location = ORGANIZATIONS.EXPORT)}
        >
          Download <FontAwesomeIcon icon="file-excel" />
        </button>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <OrganizationsTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
    </div>
  );
};

OrganizationsPage.propTypes = {
  organizations: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default OrganizationsPage;
