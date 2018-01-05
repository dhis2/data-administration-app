import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

import './App.css';

// Components
import HomePage from './pages/homepage/Homepage';
import DataIntegrity from './pages/DataIntegrity';
import Maintenance from './pages/maintenance/Maintenance';
import ResourceTable from './pages/resource-table/ResourceTable';
import Locale from './pages/Locale';
import SqlView from './pages/SqlView';
import DataStatistics from './pages/data-statistics/DataStatistics';
import LockException from './pages/LockException';
import MinMaxValueGeneration from './pages/MinMaxValueGeneration';
import Scheduling from './pages/Scheduling';

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
    SCHEDULING_SECTION_KEY,
} from './configs/sections.conf';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            container: <HomePage t={this.props.t} setContainer={this.setContainer} />,
            currentSection: HOME_SECTION_KEY,
        };

        this.setContainer = this.setContainer.bind(this);
    }

    setContainer(sectionKey) {
        let container = <HomePage t={this.props.t} setContainer={this.setContainer} />;
        switch (sectionKey) {
        case HOME_SECTION_KEY:
            container = <HomePage t={this.props.t} setContainer={this.setContainer} />;
            break;
        case DATA_INTEGRITY_SECTION_KEY:
            container = <DataIntegrity t={this.props.t} />;
            break;
        case MAINTENANCE_SECTION_KEY:
            container = <Maintenance t={this.props.t} />;
            break;
        case RESOURCE_TABLE_SECTION_KEY:
            container = <ResourceTable t={this.props.t} />;
            break;
        case LOCALE_SECTION_KEY:
            container = <Locale t={this.props.t} />;
            break;
        case SQL_VIEW_SECTION_KEY:
            container = <SqlView t={this.props.t} />;
            break;
        case DATA_STATISTICS_SECTION_KEY:
            container = <DataStatistics t={this.props.t} />;
            break;
        case LOCK_EXCEPTION_SECTION_KEY:
            container = <LockException t={this.props.t} />;
            break;
        case MIN_MAX_VALUE_GENERATION_SECTION_KEY:
            container = <MinMaxValueGeneration t={this.props.t} />;
            break;
        case SCHEDULING_SECTION_KEY:
            container = <Scheduling t={this.props.t} />;
            break;
        default:
            container = <HomePage t={this.props.t} setContainer={this.setContainer} />;
        }

        this.setState(
            {
                container,
                currentSection: sectionKey,
            },
        );
    }

    render() {
        const t = this.props.t;
        const translatedSections = sections.map(section => Object.assign(section, { label: t(section.label) }));

        return (
            <div className="container">
                <HeaderBar />
                <Sidebar
                    sections={translatedSections}
                    currentSection={this.state.currentSection}
                    onChangeSection={this.setContainer}
                />
                <div className="content-area">
                    {this.state.container}
                </div>
            </div>
        );
    }
}

export default App;
