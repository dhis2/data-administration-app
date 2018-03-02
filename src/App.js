import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

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
    };

    static childContextTypes = {
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            duration: PropTypes.number,
        }),
        currentSection: PropTypes.string,
        updateAppState: PropTypes.func,
        translator: PropTypes.func,
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
            translator: this.props.t,
        };
    }

    updateAppState(appState) {
        const newAppState = Object.assign({}, appState);

        if (typeof this.state.snackbarTimeoutId !== 'undefined') {
            clearTimeout(this.state.snackbarTimeoutId);
        }

        // Hack to hide previous snackbar before changing its style
        if (this.state.showSnackbar && newAppState.showSnackbar) {
            const newShowSnackbar = appState.showSnackbar;
            const newSnackbarConf = appState.snackbarConf;
            newAppState.showSnackbar = false;
            newAppState.snackbarConf = this.state.snackbarConf;

            this.state.snackbarTimeoutId = setTimeout(() => {
                this.setState({ ...newAppState, showSnackbar: newShowSnackbar, snackbarConf: newSnackbarConf });
            }, 500);
        }

        if (newAppState.currentSection
            && !newAppState.pageState
            && this.state.currentSection !== newAppState.currentSection) {
            // clear page state because we are updating page
            this.setState({ ...newAppState, pageState: undefined, showSnackbar: false });
        } else {
            this.setState(newAppState);
        }
    }

    render() {
        const translator = this.props.t;
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                label: translator(section.info.label),
            },
        ));

        return (
            <div className={styles.container}>
                <HeaderBar />
                <SidebarMenu sections={translatedSections} currentSection={this.state.currentSection} />
                <div className={styles.contentWrapper}>
                    <div className={styles.contentArea}>
                        <AppRouter
                            pageState={this.state.pageState}
                        />
                    </div>
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
