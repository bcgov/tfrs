import React from 'react';

const ContactUsPage = props => (
  <div className="page_contact_us">
    <h1>Contact Us</h1>
    <h3>Need help with TFRS?</h3>
    <p>
      Contact the Low Carbon Fuels Branch at <a href="mailto:lcfrr@gov.bc.ca">lcfrr@gov.bc.ca</a>
    </p>
    <h3>Need help with BCeID?</h3>
    <p>
      <a href="https://www.bceid.ca/aboutbceid/contact_us.aspx" rel="noopener noreferrer" target="_blank">Contact the BCeID Help Desk</a>
    </p>
    <h3>Need help with IDIR?</h3>
    <p>
      Contact your IDIR security administrator or the 7-7000 Service Desk at:
    </p>
    <p>
      Phone: 250-387-7000 <br />
      Email: <a href="mailto:77000@gov.bc.ca">77000@gov.bc.ca</a>
    </p>
  </div>
);

export default ContactUsPage;
