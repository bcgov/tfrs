import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Loading = props => (
  <div className="text-center">
    <FontAwesomeIcon icon="circle-notch" spin size="6x" />
  </div>
);

export default Loading;
