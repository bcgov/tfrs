import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom'
import * as Routes from '../constants/routes.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import {IntlProvider} from 'react-intl';

export default class App extends Component {
 
  componentDidMount() {
    this.updateContainerPadding();
    window.addEventListener('resize', () => this.updateContainerPadding())
  }

  updateContainerPadding() {
    let headerHeight = document.getElementById('header-main').clientHeight;
    let topSpacing = 30;
    let totalSpacing = headerHeight + topSpacing; 
    document.getElementById('main').setAttribute('style', 'padding-top:' + totalSpacing + 'px;');
  }
  
  render() {
    return (
      <IntlProvider locale="en-CA">
        <div className="App">
          <Navbar />
          <div id="main" className="template container"> 
            {this.props.children}
          </div>
          <Footer />
        </div>
      </IntlProvider>
    );
  }
}
