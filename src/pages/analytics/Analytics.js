import classNames from 'classnames'
import {
    ERROR,
    LOADING,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import {
    Card,
    CardText,
    GridTile,
    Checkbox,
    SelectField,
    MenuItem,
    RaisedButton,
} from 'material-ui'
import React from 'react'
import NotificationsTable from '../../components/notifications-table/NotificationsTable'
import PageHelper from '../../components/page-helper/PageHelper'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import {
    PULL_INTERVAL,
    ANALYTICS_TABLES_ENDPOINT,
    ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT,
    DEFAULT_LAST_YEARS,
    LAST_YEARS_INPUT_KEY,
    analyticsCheckboxes,
    lastYearElements,
} from '../analytics/analytics.conf'
import Page from '../Page'
import styles from '../Page.module.css'
import { getDocsKeyForSection } from '../sections.conf'

class Analytics extends Page {
    constructor() {
        super()

        const checkboxes = {}
        for (let i = 0; i < analyticsCheckboxes.length; i++) {
            const checkbox = analyticsCheckboxes[i]
            checkboxes[checkbox.key] = { checked: false }
        }

        this.state = {
            checkboxes,
            lastYears: DEFAULT_LAST_YEARS,
            intervalId: null,
        }

        this.initAnalyticsTablesGeneration = this.initAnalyticsTablesGeneration.bind(
            this
        )
        this.onChangeLastYears = this.onChangeLastYears.bind(this)
    }

    componentDidMount() {
        this.requestTaskSummary()
    }

    componentWillUnmount() {
        super.componentWillUnmount()

        this.cancelPoollingRequests()
    }

    cancelPoollingRequests() {
        clearInterval(this.state.intervalId)
    }

    setLoadingPageState() {
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
            },
            pageState: {
                loading: true,
                notifications: [],
            },
        })
    }

    setLoadedPageWithErrorState(error) {
        const messageError =
            error && error.message
                ? error.message
                : i18n.t(i18nKeys.analytics.unexpectedError)
        this.cancelPoollingRequests()
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ERROR,
                message: messageError,
            },
            pageState: {
                loading: false,
            },
        })
    }

    areActionsDisabled() {
        return this.props.loading
    }

    buildFormData() {
        let formData = null
        const checkboxKeys = Object.keys(this.state.checkboxes)
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i]
            const checked = this.state.checkboxes[key].checked
            formData = formData || new FormData()
            formData.append(key, checked)
        }

        if (this.state.lastYears !== DEFAULT_LAST_YEARS) {
            formData.append(LAST_YEARS_INPUT_KEY, this.state.lastYears)
        }

        return formData
    }

    isAnalyzingTables = () => !!this.state.intervalId

    startsPooling = () =>
        setInterval(() => {
            this.requestTaskSummary()
        }, PULL_INTERVAL)

    isJobInProgress = jobNotifications =>
        // When the most recent job comes back as completed the whole process is done
        jobNotifications.every(notification => !notification.completed)

    initAnalyticsTablesGeneration() {
        const api = this.context.d2.Api.getApi()
        const formData = this.buildFormData()

        this.setLoadingPageState()
        api.post(ANALYTICS_TABLES_ENDPOINT, formData)
            .then(response => {
                if (this.isPageMounted() && response) {
                    const intervalId = this.startsPooling()

                    this.setState({
                        intervalId,
                    })
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    updateStateForInProgressJobAccordingTaskSummaryResponse = taskSummaryResponse => {
        const taskSummary = []
        if (taskSummaryResponse) {
            for (const notifications of Object.values(taskSummaryResponse)) {
                taskSummary.concat(notifications)
            }
        }
        const completed = !this.isJobInProgress(taskSummary)

        if (completed) {
            this.cancelPoollingRequests()
        }

        this.context.updateAppState({
            showSnackbar: !completed,
            pageState: {
                notifications: this.getUpdatedNotifications(taskSummary),
                loading: !completed,
            },
        })
    }

    getUpdatedNotifications(taskSummary = []) {
        // Notification table needs to be updated when new tasks are added
        if (taskSummary.length <= this.props.notifications.length) {
            return this.props.notifications
        }

        const lastIndex = taskSummary.length - 1

        // Reverse to sort oldest-newest
        // Assumption: all tasks are completed, apart from the last one,
        // which is the in-progress task.
        // Exception is when the most recent task comes back as completed
        // this indicates the entire process is done, so we respect that completed status.
        return taskSummary.reverse().map((x, i) => ({
            ...x,
            completed: x.completed || i < lastIndex,
        }))
    }

    verifyInProgressJobsForTaskSummaryResponseAndUpdateState = taskSummaryResponse => {
        if (
            taskSummaryResponse &&
            taskSummaryResponse.length &&
            this.isJobInProgress(taskSummaryResponse)
        ) {
            const intervalId = this.startsPooling()

            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                },
                pageState: {
                    notifications: this.getUpdatedNotifications(
                        taskSummaryResponse
                    ),
                    loading: true,
                    intervalId,
                },
            })
        }
    }

    requestTaskSummary() {
        const api = this.context.d2.Api.getApi()

        api.get(ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT)
            .then(taskSummaryResponse => {
                /* not mounted finishes */
                if (!this.isPageMounted()) {
                    return
                }

                // showing current job
                if (this.isAnalyzingTables()) {
                    this.updateStateForInProgressJobAccordingTaskSummaryResponse(
                        taskSummaryResponse
                    )
                    // so far no jobs is being processed, lets check if server is has any in progress job
                } else {
                    this.verifyInProgressJobsForTaskSummaryResponseAndUpdateState(
                        taskSummaryResponse
                    )
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    onChangeLastYears(event, index, value) {
        this.setState({
            lastYears: value,
        })
    }

    toggleCheckbox = (initialCheckboxes, key) => () => {
        const checkboxes = Object.assign({}, initialCheckboxes)
        const checkboxState = checkboxes[key].checked
        checkboxes[key].checked = !checkboxState
        this.setState({ checkboxes })
    }

    renderCheckbox = checkbox => (
        <GridTile
            key={checkbox.key}
            className={classNames('col-xs-12 col-md-6', styles.formControl)}
        >
            <Checkbox
                label={i18n.t(checkbox.label)}
                checked={this.state.checkboxes[checkbox.key].checked}
                onCheck={this.toggleCheckbox(
                    this.state.checkboxes,
                    checkbox.key
                )}
                labelStyle={{ color: '#000000' }}
                iconStyle={{ fill: '#000000' }}
                disabled={this.areActionsDisabled()}
            />
        </GridTile>
    )

    render() {
        const gridElements = analyticsCheckboxes.map(this.renderCheckbox)
        return (
            <div>
                <h1>
                    {i18n.t(i18nKeys.analytics.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <Card className={styles.cardContainer}>
                    <CardText>
                        <h4 className={styles.uppercase}>
                            {i18nKeys.analytics.analyticsTablesUpdateHeader}
                        </h4>
                        <div
                            className={classNames(styles.gridContainer, 'row')}
                        >
                            {gridElements}
                            <SelectField
                                disabled={this.areActionsDisabled()}
                                className="col-xs-12 col-md-6"
                                floatingLabelText={i18n.t(
                                    i18nKeys.analytics.lastYearsLabel
                                )}
                                onChange={this.onChangeLastYears}
                                value={this.state.lastYears}
                                fullWidth
                            >
                                {lastYearElements.map(item => (
                                    <MenuItem
                                        key={item.key}
                                        value={item.value}
                                        primaryText={i18n.t(item.displayName)}
                                    />
                                ))}
                            </SelectField>
                        </div>
                        <RaisedButton
                            id={'startExportBtnId'}
                            primary
                            label={i18n.t(i18nKeys.analytics.actionButton)}
                            onClick={this.initAnalyticsTablesGeneration}
                            disabled={this.areActionsDisabled()}
                        />
                    </CardText>
                </Card>
                {(this.props.notifications || []).length > 0 && (
                    <Card className={styles.cardContainer}>
                        <CardText>
                            <NotificationsTable
                                notifications={this.props.notifications}
                                animateIncomplete
                            />
                        </CardText>
                    </Card>
                )}
            </div>
        )
    }
}

export default Analytics
