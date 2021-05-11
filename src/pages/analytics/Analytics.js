import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Card,
    Checkbox,
    SingleSelectField,
    SingleSelectOption,
    NoticeBox,
} from '@dhis2/ui'
import { getInstance as getD2Instance } from 'd2'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NotificationsTable from '../../components/notifications-table/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import {
    PULL_INTERVAL,
    ANALYTICS_TABLES_ENDPOINT,
    ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT,
    DEFAULT_LAST_YEARS,
    LAST_YEARS_INPUT_KEY,
    analyticsCheckboxes,
    lastYearElements,
} from '../analytics/analytics.conf'
import styles from './Analytics.module.css'

class Analytics extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    constructor() {
        super()

        const checkboxes = {}
        for (let i = 0; i < analyticsCheckboxes.length; i++) {
            const checkbox = analyticsCheckboxes[i]
            checkboxes[checkbox.key] = false
        }

        this.state = {
            loading: false,
            error: null,
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
        this.setState({ loading: true, error: null, notifications: [] })
    }

    unsetLoadingPageState() {
        this.setState({ loading: false })
    }

    setLoadedPageWithErrorState(error) {
        console.error(error)
        const messageError =
            error && error.message
                ? error.message
                : i18nKeys.analytics.unexpectedError
        this.stopTaskProgressPolling()
        this.setState({ error: messageError, loading: false })
    }

    /*
     * API requests
     */
    initAnalyticsTablesGeneration = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()
        const formData = this.buildFormData()

        this.setLoadingPageState()

        try {
            const { response } = await api.post(
                ANALYTICS_TABLES_ENDPOINT,
                formData
            )
            if (response) {
                this.setState(
                    { taskId: response.id },
                    this.startTaskProgressPolling
                )
            }
        } catch (error) {
            this.setLoadedPageWithErrorState(error)
        }
    }

    requestTaskSummary = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        try {
            const taskSummaryResponse = await api.get(
                ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT
            )
            const taskId = this.getActiveTaskIdFromSummary(taskSummaryResponse)
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
        } catch (error) {
            this.setLoadedPageWithErrorState(error)
        }
    }

    requestTaskProgress = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        try {
            const taskNotifications = await api.get(
                `${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}/${this.state.taskId}`
            )
            const completed = this.isTaskCompleted(taskNotifications)

            if (completed) {
                this.stopTaskProgressPolling()
                this.unsetLoadingPageState()
            }

            this.setState({
                notifications: this.getUpdatedNotifications(taskNotifications),
            })
        } catch (error) {
            this.setLoadedPageWithErrorState(error)
        }
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

    buildFormData() {
        const formData = new FormData()
        for (const [key, checked] of Object.entries(this.state.checkboxes)) {
            formData.append(key, checked)
        }

        if (this.state.lastYears !== DEFAULT_LAST_YEARS) {
            formData.append(LAST_YEARS_INPUT_KEY, this.state.lastYears)
        }

        return formData
    }

    handleLastYearsChange = lastYears => {
        this.setState({ lastYears })
    }

    toggleCheckbox = key => {
        this.setState({
            checkboxes: {
                ...this.state.checkboxes,
                [key]: !this.state.checkboxes[key],
            },
        })
    }

    render() {
        return (
            <div>
                <PageHeader
                    sectionKey={this.props.sectionKey}
                    title={i18nKeys.analytics.title}
                />
                <Card className={styles.card}>
                    {this.state.error && (
                        <NoticeBox className={styles.noticeBox} error>
                            {this.state.error}
                        </NoticeBox>
                    )}
                    <div className={styles.form}>
                        <div className={styles.checkboxes}>
                            {analyticsCheckboxes.map(checkbox => (
                                <Checkbox
                                    key={checkbox.key}
                                    className={styles.checkbox}
                                    label={checkbox.label}
                                    checked={
                                        this.state.checkboxes[checkbox.key]
                                    }
                                    onChange={() =>
                                        this.toggleCheckbox(checkbox.key)
                                    }
                                    disabled={this.state.loading}
                                />
                            ))}
                        </div>
                        <SingleSelectField
                            className={styles.lastYearsSelect}
                            label={i18n.t(
                                'Number of last years of data to include'
                            )}
                            selected={this.state.lastYears}
                            onChange={({ selected }) =>
                                this.handleLastYearsChange(selected)
                            }
                            disabled={this.state.loading}
                        >
                            {lastYearElements.map(item => (
                                <SingleSelectOption
                                    key={item.key}
                                    label={item.displayName}
                                    value={item.value}
                                />
                            ))}
                        </SingleSelectField>
                    </div>
                    <Button
                        primary
                        onClick={this.initAnalyticsTablesGeneration}
                        disabled={this.state.loading}
                    >
                        {i18n.t('Start export')}
                    </Button>
                </Card>
                {(this.state.notifications || []).length > 0 && (
                    <Card className={styles.card}>
                        <NotificationsTable
                            notifications={this.state.notifications}
                            animateIncomplete
                        />
                    </Card>
                )}
            </div>
        )
    }
}

export default Analytics
