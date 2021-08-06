import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, Button, NoticeBox, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
import { getActiveTaskIdFromSummary } from '../../get-active-task-id-from-summary'
import { getUpdatedNotifications } from '../../get-updated-notifications'
import { i18nKeys } from '../../i18n-keys'
import styles from './ResourceTables.module.css'
import { useResourceTablesPoll } from './use-resource-tables-poll'

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

const startResourceTablesGenerationMutation = {
    resource: 'resourceTables',
    type: 'create',
}

const existingTasksQuery = {
    tasks: {
        resource: 'system/tasks/RESOURCE_TABLE',
    },
}

const ResourceTable = ({ sectionKey }) => {
    const poll = useResourceTablesPoll()
    useDataQuery(existingTasksQuery, {
        onComplete: data => {
            const taskId = getActiveTaskIdFromSummary(data.tasks)
            if (taskId) {
                poll.start({ taskId })
            }
        },
    })
    const [
        handleStartResourceTablesGeneration,
        { loading, error },
    ] = useDataMutation(startResourceTablesGenerationMutation, {
        onComplete: data => {
            const { id: taskId } = data.response
            poll.start({ taskId })
        },
    })
    const notifications = poll.data ? getUpdatedNotifications(poll.data) : []

    return (
        <div>
            <PageHeader
                title={i18nKeys.resourceTables.title}
                sectionKey={sectionKey}
            />
            <Card className={styles.card}>
                {(error || poll.error) && (
                    <NoticeBox className={styles.noticeBox} error>
                        {error?.message || poll.error.message}
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
                    onClick={handleStartResourceTablesGeneration}
                    disabled={loading || poll.polling}
                >
                    {loading || poll.polling ? (
                        <>
                            {i18n.t('Generating tables...')}
                            <CircularLoader small />
                        </>
                    ) : (
                        i18n.t('Generate tables')
                    )}
                </Button>
                {notifications.length > 0 && (
                    <div className={styles.notificationsTable}>
                        <NotificationsTable notifications={notifications} />
                    </div>
                )}
            </Card>
        </div>
    )
}

ResourceTable.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default ResourceTable
