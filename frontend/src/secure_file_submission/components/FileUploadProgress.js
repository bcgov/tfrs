/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFileSize } from '../../utils/functions';
import {ProgressBar} from "react-bootstrap";

class FileUploadProgress extends Component {

  render() {
    return (
      <div>
        {this.props.files.map((file, index) => (
          <div className="row" key={file.name}>
            <div className="col-xs-6 filename">
              <span className="text">{file.name}</span>
            </div>
            <div className="col-xs-5">

            <ProgressBar
              now={this.props.progress[index].progress.loaded}
              max={this.props.progress[index].progress.total}
            />

            </div>

            <div className="col-xs-1 size">
              {getFileSize(file.size)}
            </div>
          </div>
        ))
        }
      </div>
    )

  }
}

FileUploadProgress.propTypes = {
  progress:   PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    started: PropTypes.bool,
    complete: PropTypes.bool,
    error: PropTypes.bool,
    progress: PropTypes.shape({
      loaded: PropTypes.number,
      total: PropTypes.number
    })
  })).isRequired,
    files: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default FileUploadProgress;
