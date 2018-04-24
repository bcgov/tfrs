import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';
import OrganizationsTable from './OrganizationsTable';

const OrganizationsPage = (props) => {
  const { isFetching, items } = props.organizations;
  const isEmpty = items.length === 0;
  return (
    <div className="page_organizations">
      <h1>{props.title}</h1>
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
