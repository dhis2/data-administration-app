import {
    ERROR,
    LOADING,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { RaisedButton } from 'material-ui'
import { Card, CardText } from 'material-ui/Card'
import React from 'react'
import NotificationsTable from '../../components/notifications-table/NotificationsTable'
import PageHelper from '../../components/page-helper/PageHelper'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import Page from '../Page'
import pageStyles from '../Page.module.css'
import {
    PULL_INTERVAL,
    RESOURCE_TABLES_ENDPOINT,
    RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT,
} from '../resource-tables/resource-tables.conf'
import { getDocsKeyForSection } from '../sections.conf'
import styles from './ResourceTables.module.css'

class ResourceTable extends Page {
    constructor() {
        super()

        this.state = {
            taskId: null,
            notifications: [],
        }
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
                : i18n.t(i18nKeys.resourcetables.unexpectedError)
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

    isAnalyzingTables = () => this.state.intervalId

    startsPooling = () =>
        setInterval(() => {
            this.requestTaskSummary()
        }, PULL_INTERVAL)

    isJobInProgress = jobNotifications =>
        jobNotifications.every(notification => !notification.completed)

    /*
     * API requests
     */
    initResourceTablesGeneration = () => {
        const api = this.context.d2.Api.getApi()

        this.setLoadingPageState()

        api.post(RESOURCE_TABLES_ENDPOINT)
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

        api.get(RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT)
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

        api.get(`${RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT}/${this.state.taskId}`)
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
                // First notification is last array item, so it's timestamp represents the task start
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

    render() {
        return (
            <div>
                <h1>
                    {i18n.t(i18nKeys.resourceTables.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <Card className={pageStyles.cardContainer}>
                    <CardText>
                        <div className={styles.description}>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .organisationUnitStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_orgunitstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .organistionUnitCategoryOptionCombo
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_orgunitstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .categoryOptionGroupSetStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_categoryoptiongroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .dataElementGroupSetStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_dataelementgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .indicatorGroupSetStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_indicatorgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .organisationUnitGroupSetStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_organisationunitgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables.categoryStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_categorystructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .dataElementCategoryOptionComboName
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_categoryoptioncomboname)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables.dataElementStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_dataelementstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables.periodStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_periodstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables.dataPeriodStructure
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_dateperiodstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(
                                    i18nKeys.resourceTables
                                        .dataElementCategoryOptionCombinations
                                )}{' '}
                                <span className={styles.tableName}>
                                    (_dataelementcategoryoptioncombo)
                                </span>
                            </div>
                        </div>
                        <RaisedButton
                            id={'generateTablesBtnId'}
                            primary
                            label={i18n.t(i18nKeys.resourceTables.actionButton)}
                            onClick={this.initResourceTablesGeneration}
                            disabled={this.props.loading}
                        />
                    </CardText>
                </Card>
                {(this.state.notifications || []).length > 0 && (
                    <Card className={pageStyles.cardContainer}>
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

export default ResourceTable
