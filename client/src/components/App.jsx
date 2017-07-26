import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom'
import * as Routes from '../constants/routes.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import FuelSuppliers from './fuel_suppliers/FuelSuppliers.jsx';

export default class App extends Component {
 
  componentDidMount() {
    this.updateContainerPadding();
    window.addEventListener('resize', () => this.updateContainerPadding())
  }

  updateContainerPadding() {
    let headerHeight = document.getElementById('header-main').clientHeight;
    document.getElementById('main').setAttribute('style', 'padding-top:' + headerHeight + 'px;');
  }
  
  render() {
    return (
      <div className="App">
        <Navbar />
        <div id="main" className="template container"> 
          {this.props.children}
        </div>
      </div>
    );
  }
}
