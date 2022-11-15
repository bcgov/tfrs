import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../../app/components/Modal'

const RoundedNumericSpan = props => (
  (props.value &&
    <span>{Number(props.value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span> ||
    <span><i>pending</i></span>
  )
)

class ScheduleBGHGeniusProvisionModal extends React.Component {
  render () {
    const
      filteredSelections = this.props.availableSelections.filter((sel) => {
        if (this.props.matchFuelClass) {
          if (this.props.matchFuelClass !== sel.fuelClass) {
            return false
          }
        }
        if (this.props.matchFuelType) {
          if (this.props.matchFuelType !== sel.fuelType) {
            return false
          }
        }
        return true
      })

    return (
      <Modal
        id="schedule-d-modal"
        title="Select Schedule D Entry"
        initiallyShown
        key="schedule-d-modal"
        cancelLabel="Cancel"
        showConfirmButton={false}
        handleCancel={this.props.handleCancel}
      >
        <div>
          <h2>Select an existing Schedule D Record</h2>
          {this.props.matchFuelClass && (<p>Matching only fuel class <i>{this.props.matchFuelClass}</i></p>)}
          {this.props.matchFuelType && (<p>Matching only fuel type <i>{this.props.matchFuelType}</i></p>)}
          <div className="center-block">
            {filteredSelections.length === 0 &&
            <p>No applicable Schedule D entries exist</p>}
            <ul>
              {filteredSelections.map((sel, i) => (
                <li key={`selection-${i}`}>
                  <a
                    href="#"
                    onClick={() => this.props.handleSelection(sel)}
                    data-dismiss="modal"
                  >
                    Select {sel.fuelType} <RoundedNumericSpan value={sel.intensity} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    )
  }
}

ScheduleBGHGeniusProvisionModal.defaultProps = {
  matchFuelType: null,
  matchFuelClass: null,
  handleCancel: null
}

ScheduleBGHGeniusProvisionModal.propTypes = {
  availableSelections: PropTypes.arrayOf(PropTypes.shape({
    fuelType: PropTypes.string,
    fuelClass: PropTypes.string,
    intensity: PropTypes.oneOf(PropTypes.number, PropTypes.string)
  })).isRequired,
  matchFuelType: PropTypes.string,
  matchFuelClass: PropTypes.string,
  handleSelection: PropTypes.func.isRequired,
  handleCancel: PropTypes.func
}

export default ScheduleBGHGeniusProvisionModal
