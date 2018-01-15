import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import './App.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from './pages/sections.conf';

import SidebarMenu from './components/sidebar-menu/SidebarMenu';
import AppRouter from './components/app-router/AppRouter';

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
        this.showSnackbar = this.showSnackbar.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    handleSelectedMenu(sectionKey) {
        this.setState({ currentSection: sectionKey });
    }

    closeSnackbar() {
        this.setState({ snackbar: undefined });
    }

    showSnackbar(message) {
        this.setState({ snackbar: message });
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
                <Snackbar
                    className="snackbar"
                    message={this.state.snackbar || ''}
                    autoHideDuration={2500}
                    onRequestClose={this.closeSnackbar}
                    open={!!this.state.snackbar}
                />
                <SidebarMenu sections={translatedSections} currentSection={this.state.currentSection} />
                <div className="content-area">
                    <AppRouter updateSelectedMenu={this.handleSelectedMenu} />
                </div>
            </div>
        );
    }
}

export default App;
