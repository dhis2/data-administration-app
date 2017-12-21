import React, { Component } from 'react';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends Component {
  render() {
    return (
        <div className="app-wrapper">
            <HeaderBar />
            <div id="container">

            </div>
        </div>
    );
  }
}

export default App;
