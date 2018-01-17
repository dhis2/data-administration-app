import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import SidebarMenu from './components/sidebar-menu/SidebarMenu';
import AppRouter from './components/app-router/AppRouter';

import './App.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from './pages/sections.conf';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            currentSection: HOME_SECTION_KEY,
        };

        this.handleSelectedMenu = this.handleSelectedMenu.bind(this);
    }

    handleSelectedMenu(sectionKey) {
        this.setState({ currentSection: sectionKey });
    }

    render() {
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                label: this.props.t(section.info.label),
            },
        ));

        return (
            <div className="container">
                <HeaderBar />
                <SidebarMenu sections={translatedSections} currentSection={this.state.currentSection} />
                <div className="content-area">
                    <AppRouter updateSelectedMenu={this.handleSelectedMenu} />
                </div>
            </div>
        );
    }
}

export default App;
