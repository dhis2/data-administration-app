import React, { Component } from 'react';

// React i18next
import { translate } from 'react-i18next';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends Component {
  render() {
    const t = this.props.t;
    return (
        <div className="app-wrapper">
            <HeaderBar />
            <div id="container">
              { t('Data Admin App') }
            </div>
        </div>
    );
  }
}

export default translate()(App);
