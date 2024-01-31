import React from 'react'

const LcfsWebsiteLink = props => (
  <div className="dashboard-card feedback">
    <h2>Low Carbon Fuel Standard</h2>
    <p style={{ marginBottom: 5 }}>
      Visit our website at:
    </p>
    <a
      href="https://gov.bc.ca/lowcarbonfuels"
      rel="noopener noreferrer"
      target="_blank"
    >
      https://gov.bc.ca/lowcarbonfuels
    </a>
  </div>
)

LcfsWebsiteLink.defaultProps = {
}

LcfsWebsiteLink.propTypes = {
}

export default LcfsWebsiteLink
