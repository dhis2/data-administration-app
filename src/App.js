import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';

import Loader from 'react-loader-advanced';
import SidebarMenu from './components/sidebar-menu/SidebarMenu';
import AppRouter from './components/app-router/AppRouter';

import styles from './App.css';

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
            loading: false,
        };

        this.handleSelectedMenu = this.handleSelectedMenu.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    handleSelectedMenu(sectionKey) {
        this.setState({ currentSection: sectionKey });
    }

    toggleLoading(pageState) {
        this.setState({ loading: pageState.loading, pageState });
    }

    render() {
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                label: this.props.t(section.info.label),
            },
        ));

        const pageState = this.state.pageState || {};
        const isLoading = this.state.loading;
        const loadingCombo = (
            <span>
                <div><CircularProgress /></div>
                <h3>{ this.props.t('Loading...') }</h3>
            </span>
        );

        return (
            <div className={styles.container}>
                <HeaderBar />
                <SidebarMenu sections={translatedSections} currentSection={this.state.currentSection} />
                <div className={styles.contentWrapper}>
                    <Loader show={isLoading} message={loadingCombo}>
                        <div className={styles.loader}>
                            <div className={styles.contentArea}>
                                <AppRouter
                                    pageState={pageState}
                                    notifySidebar={this.handleSelectedMenu}
                                    toggleLoading={this.toggleLoading}
                                />
                            </div>
                        </div>
                    </Loader>
                </div>
            </div>
        );
    }
}

export default App;
