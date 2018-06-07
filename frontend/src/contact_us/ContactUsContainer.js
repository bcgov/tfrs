/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React from 'react';
import { connect } from 'react-redux';

import ContactUsPage from './components/ContactUsPage';

const ContactUsContainer = props => (
  <ContactUsPage />
);

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsContainer);
