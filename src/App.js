import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import FeedbackSnackbar from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbar.component';
import { LOADING } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';

/* i18n */
import i18n from './locales';

import './custom-css/D2UISidebarOverrides.css';

import AppRouter from './components/app-router/AppRouter';

import styles from './App.css';

// App configs
import { sections } from './pages/sections.conf';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends PureComponent {
    static childContextTypes = {
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            duration: PropTypes.number,
        }),
        currentSection: PropTypes.string,
        updateAppState: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentSection: '',
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
            showSnackbar: this.state.showSnackbar,
            snackbarConf: this.state.snackbarConf,
            currentSection: this.state.currentSection,
            updateAppState: this.updateAppState,
        };
    }

    updateAppState(appState) {
        if (appState.currentSection
            && !appState.pageState
            && this.state.currentSection !== appState.currentSection) {
            // clear page state because we are updating page
            this.setState({ ...appState, pageState: undefined, showSnackbar: false });
        } else {
            this.setState(appState);
        }
    }

    showLoadingProgress() {
        // FIXME: remove loading snackbar info and replace with loading state
        return this.state.snackbarConf.type === LOADING && this.state.showSnackbar;
    }

    render() {
        const nonOnChangeSection = () => null;
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                icon: section.info.icon,
                label: i18n.t(section.info.label),
                containerElement: <Link to={section.path} />,
            },
        ));

        const feedbackElement = this.showLoadingProgress() ?
            (
                <div id={'circularLoadingId'} className={styles.centered}>
                    <CircularProgress />
                </div>
            ) : (
                <span id={'feedbackSnackbarId'}>
                    <FeedbackSnackbar
                        show={this.state.showSnackbar}
                        conf={this.state.snackbarConf}
                    />
                </span>
            );

        return (
            <div>
                <HeaderBar />
                <Sidebar
                    sections={translatedSections}
                    currentSection={this.state.currentSection}
                    onChangeSection={nonOnChangeSection}
                />
                <div className={styles.contentWrapper}>
                    <div className={styles.contentArea}>
                        <AppRouter
                            pageState={this.state.pageState}
                        />
                    </div>
                </div>
                {feedbackElement}
            </div>
        );
    }
}

export default App;
