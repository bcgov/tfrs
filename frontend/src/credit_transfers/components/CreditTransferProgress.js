import React from 'react';

const CreditTransferProgress = props => (
  <div className="credit-transfer-progress-bar">
    <div className="arrow-steps clearfix">
      <div className="step"><span>Draft</span></div>
      <div className="step"><span>Proposed</span></div>
      <div className="step"><span>Accepted</span></div>
      <div className="step"><span>Approved</span></div>
      <div className="step"><span>Completed</span></div>
    </div>
  </div>
);

export default CreditTransferProgress;
