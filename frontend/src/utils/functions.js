import React from 'react'
import axios from 'axios'
import CONFIG from '../config'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES, LCFS_COMPLIANCE_START_DT } from '../constants/values'
import { getCreditTransferType } from '../actions/creditTransfersActions'
import moment from 'moment-timezone'

const arrayMove = (arr, currentIndex, targetIndex) => {
  arr.splice(targetIndex, 0, arr.splice(currentIndex, 1)[0])
  return arr
}

const download = (url, params = {}) => (
  axios.get(url, {
    responseType: 'blob',
    params
  }).then((response) => {
    let filename
    if (!response || !response.headers || !response.headers['content-disposition']) {
      const currentDate = new Date()
      const { pathname } = window.location
      let module = pathname.substr(1) // get the first path

      if (pathname.indexOf('/', 1) > 0) {
        module = module.substr(0, pathname.indexOf('/', 1))
      }

      if (module === 'admin/') { // if the first pathname is admin, get the second pathname instead
        module = pathname.substr(pathname.indexOf('/', 1) + 1)
        module = module.replace('/', '')
      }

      const extension = url.substring(url.lastIndexOf('/') + 1)
      filename = `BC-LCFS_${module}_${currentDate.toISOString().substr(0, 10)}.${extension}`
    } else {
      filename = response.headers['content-disposition'].replace('attachment; filename=', '')
      filename = filename.replace(/"/g, '')
    }

    const objectURL = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = objectURL
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
  })
)

const formatFacilityNameplate = (value) => {
  let newValue = value

  if (typeof newValue === 'number') {
    newValue = newValue.toString()
  }

  newValue = newValue.replace(/\D/g, '')
  newValue = newValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  return newValue
}

// similar as above, but allows decimals
const formatNumeric = (value, decimals = 2) => {
  let newValue = value.toFixed(decimals)

  if (typeof newValue === 'number') {
    newValue = newValue.toString()
  }

  newValue = newValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  return newValue
}

const getFileSize = (bytes) => {
  if (bytes === 0) {
    return '0 bytes'
  }

  const k = 1000
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))

  if (i > 4) { // nothing bigger than a terrabyte
    i = 4
  }

  const filesize = parseFloat((bytes / k ** i).toFixed(1))

  return `${filesize} ${sizes[i]}`
}

const getIcon = (mimeType) => {
  switch (mimeType) {
    case 'application/pdf':
      return 'file-pdf'
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'text/csv':
      return 'file-excel'
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'file-powerpoint'
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'file-word'
    case 'image/gif':
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/png':
      return 'file-image'
    case 'text/plain':
      return 'file-alt'
    default:
      return 'file-download'
  }
}

const getScanStatusIcon = (status) => {
  switch (status) {
    case 'PASS':
      return 'check'
    case 'FAIL':
      return 'times'
    default:
      return 'hourglass-half'
  }
}

const getQuantity = (value) => {
  let roundedValue = ''

  if (!Number.isNaN(Number(value))) {
    roundedValue = Math.round(value * 100) / 100

    if (roundedValue < 0) {
      roundedValue *= -1
    }
  }

  return roundedValue
}

const validateFiles = files => (
  files.filter((file) => {
    if (file.size > CONFIG.SECURE_DOCUMENT_UPLOAD.MAX_FILE_SIZE) {
      return false
    }

    switch (file.type) {
      case 'application/msoutlook':
      case 'application/msword':
      case 'application/pdf':
      case 'application/vnd.ms-excel':
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'image/gif':
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':
      case 'text/csv':
      case 'text/plain':
        return file.type
      default:
        if (file.name.split('.').pop() === 'xls' || file.name.split('.').pop() === 'ppt' ||
          file.name.split('.').pop() === 'doc') {
          return file
        }

        return false
    }
  })
)

const calculatePages = (numberOfItems, pageSize) => {
  if (numberOfItems === 0) {
    return 1
  }
  return Math.ceil(numberOfItems / pageSize)
}
const cellFormatNumeric = cellValue => ({
  className: 'numeric',
  readOnly: true,
  value: cellValue,
  valueViewer: (data) => {
    const { value } = data

    if (value === '') {
      return ''
    }

    if (Number(value) < 0) {
      return <span>({Math.round(value * -1).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')})</span>
    }

    return <span>{Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
  }
})

const cellFormatNegativeNumber = cellValue => ({
  className: 'numeric',
  readOnly: true,
  value: cellValue,
  valueViewer: (data) => {
    const { value } = data

    if (value === '') {
      return ''
    }

    return <span>{Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
  }
})
const cellFormatCurrencyTotal = cellValue => ({
  className: 'total numeric',
  readOnly: true,
  value: cellValue,
  valueViewer: (data) => {
    const { value } = data

    if (value === '') {
      return ''
    }

    return <span>${Number(value).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
  }
})
const cellFormatTotal = cellValue => ({
  className: 'numeric',
  readOnly: true,
  value: cellValue,
  valueViewer: (data) => {
    const { value } = data

    if (value === '') {
      return ''
    }

    if (Number(value) < 0) {
      return <span>({Number(value * -1).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')})</span>
    }

    return <span>{Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
  }
})

const atLeastOneAttorneyAddressFieldExists = (address) => {
  if (address) {
    if (address.attorneyRepresentativename) {
      return true
    }
    if (address.attorneyStreetAddress) {
      return true
    }
    if (address.attorneyAddressOther) {
      return true
    }
    if (address.attorneyCity) {
      return true
    }
    if (address.attorneyProvince) {
      return true
    }
    if (address.attorneyPostalCode) {
      return true
    }
    if (address.attorneyCountry) {
      return true
    }
  }
  return false
}

const transformDocumentTypeDescription = (desc) => {
  if (desc === 'P3A Milestone Evidence') {
    return 'Initiative Agreement: Evidence of Completion'
  }
  if (desc === 'P3A Application') {
    return 'Initiative Agreement: Application'
  }
  return desc
}

const transformCreditTransferTypeDesc = (typeId, updateTimestamp = null) => {
  if (typeId === CREDIT_TRANSFER_TYPES.part3Award.id) {
    if (updateTimestamp >= moment('2024-01-01')) {
      return 'Initiative Agreement'
    } else {
      return 'Part 3 Award'
    }
  }
  return getCreditTransferType(typeId, updateTimestamp)
}

const transformTransactionStatusDesc = (statusId, typeId, updateTimestamp) => {
  const inputtedDate = new Date(updateTimestamp)
  if (getCreditTransferType(typeId) === 'Transfer' && inputtedDate >= LCFS_COMPLIANCE_START_DT) {
    if (statusId === CREDIT_TRANSFER_STATUS.approved.id) {
      return 'Recorded'
    } else if (statusId === CREDIT_TRANSFER_STATUS.declinedForApproval.id) {
      return 'Refused'
    }
  }
  return (
    Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === statusId)
  ).description
}

export {
  arrayMove, download, getFileSize, getIcon, getQuantity, getScanStatusIcon,
  formatFacilityNameplate, formatNumeric, validateFiles, calculatePages, cellFormatNumeric, cellFormatTotal, atLeastOneAttorneyAddressFieldExists,
  cellFormatCurrencyTotal, cellFormatNegativeNumber, transformDocumentTypeDescription, transformCreditTransferTypeDesc, transformTransactionStatusDesc
}
