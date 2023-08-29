import PropTypes from 'prop-types'
import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Tooltip from '../../app/components/Tooltip'
import { SCHEDULE_D_INPUT, SCHEDULE_D_OUTPUT } from '../../constants/schedules/scheduleColumns'

const ScheduleDTabs = (props) => {
  const {
    addSheet,
    addSheetEnabled,
    scheduleB,
    setActiveSheet,
    sheets,
    handleDeleteSheet,
    reportStatus
    
  } = props

  const handleDelete = (id) => {
    handleDeleteSheet(id)
  }
  
  const renderTabs = (active) => {
    const elements = []

    let inUsed = false

    if (scheduleB && scheduleB.records && scheduleB.records.length > 0) {
      scheduleB.records.forEach((record) => {
        if (record.scheduleD_sheetIndex !== null && record.scheduleD_sheetIndex !== '') {
          inUsed = true
        }
      })
    }

    for (let x = sheets.length - 1; x >= 0; x -= 1) {
      const sheet = sheets[x]
      const fuelType = sheet.input[1][SCHEDULE_D_INPUT.FUEL_TYPE].value

      let label = `Fuel ${sheet.id}`
      let carbonIntensity = sheet.output[SCHEDULE_D_OUTPUT.CARBON_INTENSITY][1].value

      if (fuelType) {
        label = fuelType
      }

      if (carbonIntensity) {
        carbonIntensity = Number(carbonIntensity).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        label += ` ${carbonIntensity}`
      }

      // eslint-disable-next-line function-paren-newline
      elements.push(
        <li
          className={`${(active === sheet.id) ? 'active' : ''}`}
          key={sheet.id}
          role="presentation"
        >
          <div>
            <button type="button" onClick={() => setActiveSheet(sheet.id)}>{label}</button>
            {(active === sheet.id) && (reportStatus.fuelSupplierStatus === 'Draft' ) &&
            !inUsed &&
            <button
              className="delete"
              data-toggle="modal"
              data-target="#confirmDelete"
              type="button"
              onClick={() => handleDelete(sheet.id)}
            
            >
              <FontAwesomeIcon icon="minus-circle" />
            </button>
            }
            {(active === sheet.id) &&
            inUsed &&
            <Tooltip
              show
              title="A Schedule D entry is currently in-use in Schedule B. To delete this Schedule D entry, please first delete all fuel entry rows in Schedule B that rely on the “GHGenius modelled” provision of the Act \[Section 6 (5) (d) (ii) (A)\] and then save the compliance report."
            >
              <button
                className="disabled"
                disabled
                type="button"
              >
                <FontAwesomeIcon icon="minus-circle" />
              </button>
            </Tooltip>
            }
          </div>
        </li>)
    }

    return elements
  }

  return (
    <ul className="schedule-d-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
      >
        <div>
          {addSheetEnabled &&
            <button type="button" onClick={() => addSheet(1, true)}>Add Fuel</button>
          }
        </div>
      </li>
      {renderTabs(props.active)}
    </ul>
  )
}

ScheduleDTabs.defaultProps = {
  addSheetEnabled: true,
  scheduleB: null
}

ScheduleDTabs.propTypes = {
  active: PropTypes.number.isRequired,
  addSheet: PropTypes.func.isRequired,
  addSheetEnabled: PropTypes.bool,
  scheduleB: PropTypes.shape(),
  setActiveSheet: PropTypes.func.isRequired,
  sheets: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  complianceReport: PropTypes.object.isRequired
}

export default ScheduleDTabs
