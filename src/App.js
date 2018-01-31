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
import { sections } from './pages/sections.conf';
import FeedbackSnackbar from './components/feedback-snackbar/FeedbackSnackbar';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
    }

    static childContextTypes = {
        loading: PropTypes.bool,
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            duration: PropTypes.number,
        }),
        currentSection: PropTypes.string,
        pageState: PropTypes.object,
        updateAppState: PropTypes.func,
        t: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            currentSection: '',
            loading: false,
            showSnackbar: false,
            snackbarConf: {
                type: '',
                message: '',
            },
        };

        this.updateAppState = this.updateAppState.bind(this);
    }

    getChildContext() {
        return {
            loading: this.state.loading,
            showSnackbar: this.state.showSnackbar,
            snackbarConf: this.state.snackbarConf,
            currentSection: this.state.currentSection,
            pageState: this.state.pageState,
            updateAppState: this.updateAppState,
            t: this.props.t,
        };
    }

    updateAppState(appState) {
        // clear page state because we are updating page
        if (appState.currentSection && !appState.pageState && this.state.currentSection !== appState.currentSection) {
            this.setState({ ...appState, pageState: undefined, loading: false, showSnackbar: false });
        } else {
            this.setState(appState);
        }
    }

    render() {
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                label: this.props.t(section.info.label),
            },
        ));

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
                                    appState={this.state}
                                    updateAppState={this.updateAppState}
                                />
                            </div>
                        </div>
                    </Loader>
                </div>
                <FeedbackSnackbar
                    show={this.state.showSnackbar}
                    conf={this.state.snackbarConf}
                />
            </div>
        );
    }
}

export default App;
