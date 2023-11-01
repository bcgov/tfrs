/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import {withRouter} from '../utils/withRouter'
import { getDocumentUploads, getDocumentUploadURL } from '../actions/documentUploads'
import SecureFileSubmissionsPage from './components/SecureFileSubmissionsPage'

class SecureFileSubmissionContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      pageSize: 10,
      filters: [],
      sort: [],
      refreshCounter: 0
    }

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this)
    this.handleFiltersChange = this.handleFiltersChange.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
  }

  componentDidMount () {
    if(this.props.location.state){
      this.setState({filters:[{id:'status',value:this.props.location.state.items}]},()=> this.loadData())
    }
  }
  

  loadData () {
    this.props.getDocumentUploads(this.state.page, this.state.pageSize, this.state.filters, this.state.sort)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.page !== prevState.page || this.state.pageSize !== prevState.pageSize || this.state.filters !== prevState.filters || this.state.refreshCounter !== prevState.refreshCounter || this.state.sort !== prevState.sort) {
      this.props.getDocumentUploads(this.state.page, this.state.pageSize, this.state.filters, this.state.sort)
    }
  }

  handlePageChange (page) {
    this.setState({ page })
  }

  handlePageSizeChange (pageSize) {
    this.setState({ pageSize })
  }

  handleFiltersChange (filters) {
    this.setState({ filters })
  }

  handleSortChange (sort) {
    this.setState({ sort })
  }

  render () {
    return (
      <SecureFileSubmissionsPage
        categories={this.props.referenceData.documentCategories}
        documentUploads={this.props.documentUploads}
        loggedInUser={this.props.loggedInUser}
        requestURL={this.props.requestURL}
        itemsCount={this.props.totalCount}
        page={this.state.page}
        pageSize={this.state.pageSize}
        filters={this.state.filters}
        sort={this.state.sort}
        handlePageChange={this.handlePageChange}
        handlePageSizeChange={this.handlePageSizeChange}
        handleFiltersChange={this.handleFiltersChange}
        handleSortChange={this.handleSortChange}
        title="File Submissions"
      />
    )
  }
}

SecureFileSubmissionContainer.defaultProps = {
}

SecureFileSubmissionContainer.propTypes = {
  documentUploads: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  getDocumentUploads: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  referenceData: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  requestURL: PropTypes.func.isRequired,
  totalCount: PropTypes.number
}

const mapStateToProps = state => ({
  documentUploads: {
    isFetching: state.rootReducer.documentUploads.isFetching,
    items: state.rootReducer.documentUploads.items,
    itemsCount: state.rootReducer.documentUploads.totalCount
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentCategories: state.rootReducer.referenceData.data.documentCategories,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
})

const mapDispatchToProps = dispatch => ({
  getDocumentUploads: bindActionCreators(getDocumentUploads, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SecureFileSubmissionContainer))
