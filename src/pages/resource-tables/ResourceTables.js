import i18n from '@dhis2/d2-i18n'
import { Card, Button, NoticeBox } from '@dhis2/ui'
import { getInstance as getD2Instance } from 'd2'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NotificationsTable from '../../components/notifications-table/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import {
    PULL_INTERVAL,
    RESOURCE_TABLES_ENDPOINT,
    RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT,
} from '../resource-tables/resource-tables.conf'
import styles from './ResourceTables.module.css'

const tables = [
    {
        key: 'organisationUnitStructure',
        name: '_orgunitstructure',
    },
    {
        key: 'organistionUnitCategoryOptionCombo',
        name: '_orgunitstructure',
    },
    {
        key: 'categoryOptionGroupSetStructure',
        name: '_categoryoptiongroupsetstructure',
    },
    {
        key: 'dataElementGroupSetStructure',
        name: '_dataelementgroupsetstructure',
    },
    {
        key: 'indicatorGroupSetStructure',
        name: '_indicatorgroupsetstructure',
    },
    {
        key: 'organisationUnitGroupSetStructure',
        name: '_organisationunitgroupsetstructure',
    },
    {
        key: 'categoryStructure',
        name: '_categorystructure',
    },
    {
        key: 'dataElementCategoryOptionComboName',
        name: '_categoryoptioncomboname',
    },
    {
        key: 'dataElementStructure',
        name: '_dataelementstructure',
    },
    {
        key: 'periodStructure',
        name: '_periodstructure',
    },
    {
        key: 'dataPeriodStructure',
        name: '_dateperiodstructure',
    },
    {
        key: 'dataElementCategoryOptionCombinations',
        name: '_dataelementcategoryoptioncombo',
    },
]

class ResourceTable extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    constructor() {
        super()
        this.state = {
            taskId: null,
            notifications: [],
            loading: false,
            error: null,
        }
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
        this.setState({
            loading: true,
            error: null,
            notifications: [],
        })
    }

    unsetLoadingPageState() {
        this.setState({ loading: false })
    }

    setLoadedPageWithErrorState(error) {
        const messageError = error?.message
            ? error.message
            : i18nKeys.resourcetables.unexpectedError
        this.stopTaskProgressPolling()
        this.setState({ error: messageError, loading: false })
    }

    /*
     * API requests
     */
    initResourceTablesGeneration = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        this.setLoadingPageState()

        try {
            const { response } = await api.post(RESOURCE_TABLES_ENDPOINT)
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
                RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT
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
                `${RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT}/${this.state.taskId}`
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
        // First array item is most recent notification, which can be used to
        // read the completed prop for the entire task
        return taskNotifications[0].completed
    }

    render() {
        return (
            <div>
                <PageHeader
                    title={i18nKeys.resourceTables.title}
                    sectionKey={this.props.sectionKey}
                />
                <Card className={styles.card}>
                    {this.state.error && (
                        <NoticeBox className={styles.noticeBox} error>
                            {this.state.error}
                        </NoticeBox>
                    )}
                    <div className={styles.description}>
                        {tables.map(table => (
                            <div key={table.key}>
                                {i18nKeys.resourceTables.tables[table.key]}
                                <span
                                    title="Table name"
                                    className={styles.tableName}
                                >
                                    ({table.name})
                                </span>
                            </div>
                        ))}
                    </div>
                    <Button
                        primary
                        onClick={this.initResourceTablesGeneration}
                        disabled={this.state.loading}
                    >
                        {i18n.t('Generate tables')}
                    </Button>
                </Card>
                {this.state.notifications?.length > 0 && (
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

export default ResourceTable
