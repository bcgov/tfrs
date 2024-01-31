import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import * as Lang from '../../constants/langEnUs'
import LocalTimestamp from '../../app/components/LocalTimestamp'
import Tooltip from '../../app/components/Tooltip'
import CreditTransferCommentForm from './CreditTransferCommentForm'

class CreditTransferComment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this._cancelEdit = this._cancelEdit.bind(this)
    this._beginEdit = this._beginEdit.bind(this)
  }

  _cancelEdit () {
    this.setState({
      editing: false
    })
  }

  _beginEdit () {
    this.setState({
      editing: true
    })
  }

  renderEditing () {
    return (
      <CreditTransferCommentForm
        isCreatingPrivilegedComment={this.props.comment.privilegedAccess}
        isEditingExistingComment
        comment={this.props.comment.comment}
        saveComment={this.props.saveComment}
        selectIdForModal={this.props.selectIdForModal}
        cancelComment={this._cancelEdit}
        id={this.props.comment.id}
      />
    )
  }

  renderStatic () {
    return (
      <div className={`comment panel ${this.props.comment.privilegedAccess ? 'panel-primary' : 'panel-info'}`}>
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-6">
              {this.props.comment.createUser.displayName}<br />
              {this.props.comment.createUser.organization.name}
            </div>
            <div className="col-xs-6 text-right">
              <LocalTimestamp iso8601Date={this.props.comment.updateTimestamp} />
            </div>
          </div>
        </div>
        <div className="panel-body">
          <div className="row">

            <div className="col-xs-11 comment-text">
              {this.props.comment.comment}
            </div>
            <div className="col-xs-1 text-right">
              {this.props.comment.privilegedAccess &&
              <Tooltip
                show
                title={Lang.TEXT_VISIBLE_TO_GOV}
              >
                <FontAwesomeIcon size="2x" icon="eye-slash" />
              </Tooltip>
              }
              {this.props.comment.privilegedAccess ||
              <Tooltip
                show
                title={Lang.TEXT_VISIBLE_TO_ALL}
              >
                <FontAwesomeIcon size="2x" icon="eye" />
              </Tooltip>
              }
            </div>
          </div>
          <div className="row">
            <div className="col-xs-11">
              {!this.props.isReadOnly && this.props.comment.actions.includes('EDIT_COMMENT') && [
                <button
                  className="btn btn-danger"
                  data-toggle="modal"
                  data-target="#confirmDeleteComment"
                  key="btn-delete"
                  onClick={() => this.props.selectIdForModal(this.props.comment.id)}
                  type="button"
                >
                  {Lang.BTN_DELETE}
                </button>,
                <button
                  className="btn btn-primary"
                  key="btn-edit"
                  onClick={() => this._beginEdit()}
                  type="submit"
                >
                  {Lang.BTN_EDIT}
                </button>
              ]}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    if (this.state.editing) {
      return this.renderEditing()
    }
    return this.renderStatic()
  }
}

CreditTransferComment.defaultProps = {
  isReadOnly: false,
  saveComment: () => {}
}

CreditTransferComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    createTimestamp: PropTypes.string,
    updateTimestamp: PropTypes.string,
    comment: PropTypes.string,
    privilegedAccess: PropTypes.bool,
    createUser: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      displayName: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.number
      })
    }),
    actions: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  saveComment: PropTypes.func,
  selectIdForModal: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool
}

export default CreditTransferComment
