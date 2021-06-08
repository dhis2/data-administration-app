import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, Button, NoticeBox, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import NotificationsTable from '../../components/notifications-table/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
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

const getUpdatedNotifications = taskNotifications => {
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

const ResourceTable = ({ sectionKey }) => {
    const [
        handleStartResourceTablesGeneration,
        { loading, error, data },
    ] = useDataMutation(startResourceTablesGenerationMutation)
    const poll = useResourceTablesPoll()
    const notifications = poll.data ? getUpdatedNotifications(poll.data) : []
    const isPolling =
        data && (!poll.data || !notifications.some(n => n.completed))

    useEffect(() => {
        if (loading || !data) {
            return
        }

        const { id: jobId } = data.response
        poll.start(jobId)
    }, [loading, data])

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
                    disabled={loading || isPolling}
                >
                    {loading || isPolling ? (
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
                        <NotificationsTable
                            notifications={notifications}
                            animateIncomplete
                        />
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
