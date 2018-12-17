/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Loading from '../../app/components/Loading';

const CreditTransactionRequestDetails = props => (
  <div className="credit-transaction-details">
    {props.isFetching && <Loading />}
    {!props.isFetching &&
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-12">
              <label>
                Compliance Period:
                <span className="value"></span>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label>
                Milestone ID:
                <span className="value"></span>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label>
                Agreement Name:
                <span className="value"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-6">
          <img id="img" />
          <label>
            Files:
            <button
              type="button"
              onClick={() => {
                const imageEl = document.getElementById('img');
                axios.get('http://127.0.0.1:9000/tfrs/c0230918c9944c35ae71a2ece527bf8e?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=H74MGVE2X8NSPDZTIE72%2F20181217%2F%2Fs3%2Faws4_request&X-Amz-Date=20181217T222012Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=782df3178667221e046888e962af73b34b4720b79bb5f7bb861b30993cbbeb1a', { responseType: 'blob' }).then((response) => {
                  const reader = new window.FileReader();
                  reader.readAsDataURL(response.data);
                  reader.onload = () => {
                    const imageDataUrl = reader.result;
                    imageEl.setAttribute('src', imageDataUrl);
                  };
                });
              }}
            >
              Test
            </button>
          </label>
        </div>
      </div>
    }
  </div>
);

CreditTransactionRequestDetails.defaultProps = {
};

CreditTransactionRequestDetails.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape().isRequired
};

export default CreditTransactionRequestDetails;
