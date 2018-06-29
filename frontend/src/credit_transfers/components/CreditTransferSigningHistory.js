import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CREDIT_TRANSFER_STATUS } from '../../../src/constants/values';

class CreditTransferSigningHistory extends Component {
  _renderReviewed () {
    return (
      <div>
        {this.props.reviewed.status &&
        this.props.reviewed.user &&
          <p>
            Reviewed and
            <strong
              className={`${this.props.reviewed.status.id === CREDIT_TRANSFER_STATUS.notRecommended.id
                ? 'text-danger'
                : 'text-success'
              }`}
            > {this.props.reviewed.status.status}
            </strong> by:
            <strong>
              {` ${this.props.reviewed.user.firstName} ${this.props.reviewed.user.lastName}`}
            </strong> on {moment(this.props.reviewed.creditTradeUpdateTime).format('LL')}
          </p>
        }
      </div>
    );
  }

  _renderSignatures () {
    return (
      <div>
        {this.props.signatures.length > 0 &&
        this.props.signatures.map(signature => (
          <p key={signature.user.id}>
            <strong>{signature.user.organization.name}</strong> Signing Authority:
            <strong> {signature.user.firstName} {signature.user.lastName} </strong>
            on {moment(signature.createTimestamp).format('LL')}
          </p>
        ))}
      </div>
    );
  }

  render () {
    return (
      <div>
        <h3 className="signing-authority-header" key="header">Signing History</h3>
        {this._renderSignatures()}
        {this._renderReviewed()}
      </div>
    );
  }
}

CreditTransferSigningHistory.defaultProps = {
  reviewed: {},
  signatures: []
};

CreditTransferSigningHistory.propTypes = {
  reviewed: PropTypes.shape({
    creditTradeUpdateTime: PropTypes.string,
    status: PropTypes.shape({
      id: PropTypes.number,
      status: PropTypes.string
    }),
    user: PropTypes.shape({
      displayName: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string
    })
  }),
  signatures: PropTypes.arrayOf(PropTypes.shape({
    createTimestamp: PropTypes.string,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    })
  }))
};

export default CreditTransferSigningHistory;
