/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../../../app/components/Loading';
import RolesTable from './RolesTable';

const RolesPage = (props) => {
  const { isFetching, items } = props.data;

  return (
    <div className="page_roles">
      <h1>Roles</h1>

      {isFetching && <Loading />}
      {!isFetching &&
        <RolesTable items={items} />
      }
    </div>
  );
};

RolesPage.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(RolesPage);
