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
            taskId: null,
            notifications: [],
        }
        this.intervalId = null
    }

    componentDidMount() {
        this.requestTaskSummary()
    }

    componentWillUnmount() {
        super.componentWillUnmount()

        this.stopTaskProgressPolling()
    }

    /*
     * Polling
     */
    startTaskProgressPolling = () => {
        this.intervalId = setInterval(() => {
            this.requestTaskProgress()
        }, PULL_INTERVAL)
    }

    stopTaskProgressPolling() {
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    /*
     * State utilities
     */
    setLoadingPageState() {
        this.setState({ notifications: [] })
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
            },
            pageState: {
                loading: true,
            },
        })
    }

    unsetLoadingPageState() {
        this.context.updateAppState({
            showSnackbar: false,
            snackbarConf: {
                type: LOADING,
            },
            pageState: {
                loading: false,
            },
        })
    }

    setLoadedPageWithErrorState(error) {
        console.error(error)
        const messageError =
            error && error.message
                ? error.message
                : i18n.t(i18nKeys.analytics.unexpectedError)
        this.stopTaskProgressPolling()
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

    /*
     * API requests
     */
    initAnalyticsTablesGeneration = () => {
        const api = this.context.d2.Api.getApi()
        const formData = this.buildFormData()

        this.setLoadingPageState()

        api.post(ANALYTICS_TABLES_ENDPOINT, formData)
            .then(({ response }) => {
                if (this.isPageMounted() && response) {
                    this.setState(
                        { taskId: response.id },
                        this.startTaskProgressPolling
                    )
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    requestTaskSummary() {
        const api = this.context.d2.Api.getApi()

        api.get(ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT)
            .then(taskSummaryResponse => {
                /* not mounted finishes */
                if (!this.isPageMounted()) {
                    return
                }

                const taskId = this.getActiveTaskIdFromSummary(
                    taskSummaryResponse
                )

                if (taskId) {
                    this.setLoadingPageState()
                    this.setState(
                        {
                            taskId,
                            notifications: this.getUpdatedNotifications(
                                taskSummaryResponse[taskId]
                            ),
                        },
                        this.startTaskProgressPolling
                    )
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    requestTaskProgress = () => {
        const api = this.context.d2.Api.getApi()

        api.get(`${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}/${this.state.taskId}`)
            .then(taskNotifications => {
                const completed = this.isTaskCompleted(taskNotifications)

                if (completed) {
                    this.stopTaskProgressPolling()
                    this.unsetLoadingPageState()
                }

                this.setState({
                    notifications: this.getUpdatedNotifications(
                        taskNotifications
                    ),
                })
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    /*
     * Task notification helpers
     */
    getUpdatedNotifications(taskNotifications = []) {
        // Notification table needs to be updated when new tasks are added
        if (taskNotifications.length <= this.state.notifications.length) {
            return this.state.notifications
        }

        const lastIndex = taskNotifications.length - 1

        // Reverse to sort oldest-newest
        // Assumption: all tasks are completed, apart from the last one,
        // which is the in-progress task.
        // Exception is when the most recent task comes back as completed
        // this indicates the entire process is done, so we respect that completed status.
        return taskNotifications.reverse().map((x, i) => ({
            ...x,
            completed: x.completed || i < lastIndex,
        }))
    }

    getActiveTaskIdFromSummary(taskSummaryResponse) {
        const { taskId } = Object.entries(taskSummaryResponse).reduce(
            (currLatestTask, [taskId, taskNotifications]) => {
                // First notification is last array item, so its timestamp represents the task start
                const firstTaskNotification =
                    taskNotifications[taskNotifications.length - 1]
                const time = new Date(firstTaskNotification.time)

                if (
                    !this.isTaskCompleted(taskNotifications) &&
                    time > currLatestTask.time
                ) {
                    return { taskId, time }
                }

                return currLatestTask
            },
            {
                taskId: null,
                time: new Date(0),
            }
        )

        return taskId
    }

    isTaskCompleted(taskNotifications) {
        // First array item is most recent notification, which can be used to read the completed prop for the entire task
        return taskNotifications[0].completed
    }

    /*
     * Form
     */
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

    onChangeLastYears = (event, index, value) => {
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
                {(this.state.notifications || []).length > 0 && (
                    <Card className={styles.cardContainer}>
                        <CardText>
                            <NotificationsTable
                                notifications={this.state.notifications}
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
