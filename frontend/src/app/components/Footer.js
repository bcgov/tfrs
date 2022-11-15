import React from 'react'
import { Link } from 'react-router-dom'
import * as Routes from '../../constants/routes'

/* global __VERSION__ */

const Footer = props => (
  <div id="footer" role="contentinfo">
    <div id="footerWrapper">
      <div id="footerAdminSection">
        <div id="footerAdminLinksContainer" className="container-fluid">
          <div id="footerAdminLinks" className="row">
            <ul className="inline">
              <li>
                <Link id="collapse-navbar-dashboard" to={Routes.HOME}>
                  Home
                </Link>
              </li>
              <li>
                <a id="footer-about-site" href="https://www2.gov.bc.ca/gov/content/industry/electricity-alternative-energy/transportation-energies/renewable-low-carbon-fuels/transportation-fuels-reporting-system" rel="noopener noreferrer" target="_blank">About this site</a>
              </li>
              <li>
                <a id="footer-about-disclaimer" href="http://gov.bc.ca/disclaimer/" rel="noopener noreferrer" target="_blank">Disclaimer</a>
              </li>
              <li>
                <a id="footer-about-privacy" href="http://gov.bc.ca/privacy/" rel="noopener noreferrer" target="_blank">Privacy</a>
              </li>
              <li>
                <a id="footer-about-accessibility" href="http://gov.bc.ca/webaccessibility/" rel="noopener noreferrer" target="_blank">Accessibility</a>
              </li>
              <li>
                <a id="footer-about-copyright" href="http://gov.bc.ca/copyright" rel="noopener noreferrer" target="_blank">Copyright</a>
              </li>
              <li>
                <a id="footer-about-contact" href="/contact_us" target="_self">Contact Us</a>
              </li>
            </ul>
            <div id="footer-about-version" className="inline">
              <a
                href={`https://github.com/bcgov/tfrs/releases/tag/v${__VERSION__}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                v{__VERSION__}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Footer
