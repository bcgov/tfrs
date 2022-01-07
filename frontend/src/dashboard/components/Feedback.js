import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Feedback = props => (
  <div className="dashboard-card feedback">
    <FontAwesomeIcon icon={['fas', 'envelope']} />
    <h2>We want to hear from you</h2>
    <p>
      We are always striving to improve TFRS. <br />
      {` Please send your suggestions and feedback to `}
      <a
        href="mailto:lcfs@gov.bc.ca"
        rel="noopener noreferrer"
        target="_blank"
      >
        lcfs@gov.bc.ca
      </a>
    </p>
  </div>
);

Feedback.defaultProps = {
};

Feedback.propTypes = {
};

export default Feedback;
