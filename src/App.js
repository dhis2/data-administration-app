import React, { Component } from 'react';

// React i18next
import { translate } from 'react-i18next';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

import './App.css';

// Components
import HomePageComponent from './components/homepage.component';
import DataIntegrity from './components/dataIntegrity.component';
import MaintenanceComponent from './components/maintenance.component';
import ResourceTableComponent from './components/resourceTable.component';
import LocaleComponent from './components/locale.component';
import SqlViewComponent from './components/sqlView.component';
import DataStatisticsComponent from './components/dataStatistics.component';
import LockExceptionComponent from './components/lockException.component';
import MinMaxValueGenerationComponent from './components/minMaxValueGeneration.component';
import SchedulingComponent from './components/scheduling.component';

// App configs
import {
  sections,
  HOME_SECTION_KEY,
  DATA_INTEGRITY_SECTION_KEY,
  MAINTENANCE_SECTION_KEY,
  RESOURCE_TABLE_SECTION_KEY,
  LOCALE_SECTION_KEY,
  SQL_VIEW_SECTION_KEY,
  DATA_STATISTICS_SECTION_KEY,
  LOCK_EXCEPTION_SECTION_KEY,
  MIN_MAX_VALUE_GENERATION_SECTION_KEY,
  SCHEDULING_SECTION_KEY
} from './configs/sections.conf'

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends Component {
  constructor() {
    super();

    this.state = {
      container: <HomePageComponent />,
      currentSection: HOME_SECTION_KEY
    };
  }

  setContainer(sectionKey) {
    let container = <HomePageComponent />;
    switch(sectionKey) {
      case HOME_SECTION_KEY:
        container = <HomePageComponent />;
        break;
      case DATA_INTEGRITY_SECTION_KEY:
        container = <DataIntegrity />;
        break;
      case MAINTENANCE_SECTION_KEY:
        container = <MaintenanceComponent />;
        break;
      case RESOURCE_TABLE_SECTION_KEY:
        container = <ResourceTableComponent />;
        break;
      case LOCALE_SECTION_KEY:
        container = <LocaleComponent />;
        break;
      case SQL_VIEW_SECTION_KEY:
        container = <SqlViewComponent />;
        break;
      case DATA_STATISTICS_SECTION_KEY:
        container = <DataStatisticsComponent />;
        break;
      case LOCK_EXCEPTION_SECTION_KEY:
        container = <LockExceptionComponent />;
        break;
      case MIN_MAX_VALUE_GENERATION_SECTION_KEY:
        container = <MinMaxValueGenerationComponent />;
        break;
      case SCHEDULING_SECTION_KEY:
        container = <SchedulingComponent />;
        break;
      default:
        container = <HomePageComponent />;
    }

    this.setState(
      {
        container: container,
        currentSection: sectionKey
      }
    )
  }

  render() {
    const t = this.props.t;
    const translatedSections = sections.map((section) => {
        return Object.assign(section, {label: t(section.label)});
    });

    return (
      <div className="container">
          <HeaderBar />
          <Sidebar
              sections={translatedSections}
              currentSection={this.currentSection}
              onChangeSection={this.setContainer.bind(this)}
          />
          <div className="content-area">
            {this.state.container}
          </div>
      </div>
    );
  }
}

export default translate()(App);
