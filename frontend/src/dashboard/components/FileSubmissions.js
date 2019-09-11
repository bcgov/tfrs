import React from 'react';

const FileSubmissions = props => (
  <div className="dashboard-fieldset">
    <h1>File Submissions</h1>
    There are:

    <div>
      <div className="value">
        4
      </div>
      <div className="content">
        <h2>file submissions in progress:</h2>

        <div><a href="">3 to be marked as received</a></div>
        <div><a href="">1 awaiting to bve archived</a></div>
      </div>
    </div>
  </div>
);

FileSubmissions.defaultProps = {
};

FileSubmissions.propTypes = {
};

export default FileSubmissions;
