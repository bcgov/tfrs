import React, {Component} from 'react';

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>Not Found</h1>
        <p>We give you credit for trying to find a valid page, but this is not it.</p>  
        <p>
          To trade this page for a valid one click <a href="http://dev.lowcarbonfuels.gov.bc.ca/">here</a> or learn more about Credit Validation <a href="http://www2.gov.bc.ca/gov/content/industry/electricity-alternative-energy/transportation-energies/renewable-low-carbon-fuels/credits-transfers">here</a>.
        </p>
      </div>
    )
  }
}