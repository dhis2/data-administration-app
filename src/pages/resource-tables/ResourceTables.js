import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, Button, NoticeBox, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
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

const ResourceTable = ({ sectionKey }) => {
    const poll = useResourceTablesPoll()
    const [
        handleStartResourceTablesGeneration,
        { loading, error, data },
    ] = useDataMutation(startResourceTablesGenerationMutation, {
        onComplete: data => {
            const { id: jobId } = data.response
            poll.start({ jobId })
        },
    })
    const notifications = poll.data ? getUpdatedNotifications(poll.data) : []
    const isPolling =
        data && (!poll.data || !notifications.some(n => n.completed))

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
