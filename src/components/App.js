import i18n from '@dhis2/d2-i18n'
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress'
import FeedbackSnackbar from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbar.component'
import { LOADING } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { injectTranslationsToD2 } from '../configI18n.js'
import { sections } from '../pages/sections.conf'
import AppRouter from './app-router/AppRouter'
import styles from './App.module.css'
import '../custom-css/D2UISidebarOverrides.css'

export class DumbApp extends PureComponent {
    static childContextTypes = {
        d2: PropTypes.object,
        currentSection: PropTypes.string,
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.shape({
            duration: PropTypes.number,
            message: PropTypes.string,
            type: PropTypes.string,
        }),
        updateAppState: PropTypes.func,
    }

    static propTypes = {
        d2: PropTypes.object,
    }

    constructor(props) {
        super(props)

        injectTranslationsToD2(props.d2)

        this.state = {
            currentSection: '',
            showSnackbar: false,
            snackbarConf: {
                type: '',
                message: '',
            },
        }
    }

    getChildContext() {
        return {
            d2: this.props.d2,
            showSnackbar: this.state.showSnackbar,
            snackbarConf: this.state.snackbarConf,
            currentSection: this.state.currentSection,
            updateAppState: this.updateAppState,
        }
    }

    updateAppState = appState => {
        if (
            appState.currentSection &&
            !appState.pageState &&
            this.state.currentSection !== appState.currentSection
        ) {
            // clear page state because we are updating page
            this.setState({
                ...appState,
                pageState: undefined,
                showSnackbar: false,
            })
        } else {
            this.setState(appState)
        }
    }

    showLoadingProgress() {
        // FIXME: remove loading snackbar info and replace with loading state
        return (
            this.state.snackbarConf.type === LOADING && this.state.showSnackbar
        )
    }

    render() {
        const nonOnChangeSection = () => null
        const translatedSections = sections.map(section =>
            Object.assign(section, {
                icon: section.info.icon,
                label: i18n.t(section.info.label),
                containerElement: <Link to={section.path} />,
            })
        )

        const feedbackElement = this.showLoadingProgress() ? (
            <div className={styles.centered}>
                <CircularProgress />
            </div>
        ) : (
            <FeedbackSnackbar
                show={this.state.showSnackbar}
                conf={this.state.snackbarConf}
            />
        )

        return (
            <div>
                <Sidebar
                    sections={translatedSections}
                    currentSection={this.state.currentSection}
                    onChangeSection={nonOnChangeSection}
                />
                <div className={styles.contentWrapper}>
                    <div className={styles.contentArea}>
                        <AppRouter pageState={this.state.pageState} />
                    </div>
                </div>
                {feedbackElement}
            </div>
        )
    }
}

export default withRouter(DumbApp)
