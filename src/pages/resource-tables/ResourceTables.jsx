import i18n from '@dhis2/d2-i18n'
import { Card, Button, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { i18nKeys } from '../../i18n-keys.js'
import styles from './ResourceTables.module.css'
import { useResourceTables } from './use-resource-tables.js'

const tables = [
    {
        key: 'organisationUnitStructure',
        name: 'analytics_rs_orgunitstructure',
    },
    {
        key: 'dataElementGroupSetStructure',
        name: 'analytics_rs_dataelementgroupsetstructure',
    },
    {
        key: 'indicatorGroupSetStructure',
        name: 'analytics_rs_indicatorgroupsetstructure',
    },
    {
        key: 'organisationUnitGroupSetStructure',
        name: 'analytics_rs_organisationunitgroupsetstructure',
    },
    {
        key: 'categoryStructure',
        name: 'analytics_rs_categorystructure',
    },
    {
        key: 'dataElementCategoryOptionComboName',
        name: 'analytics_rs_categoryoptioncomboname',
    },
    {
        key: 'dataElementStructure',
        name: 'analytics_rs_dataelementstructure',
    },
    {
        key: 'dataPeriodStructure',
        name: 'analytics_rs_dateperiodstructure',
    },
    {
        key: 'periodStructure',
        name: 'analytics_rs_periodstructure',
    },
    {
        key: 'dataElementCategoryOptionCombinations',
        name: 'analytics_rs_dataelementcategoryoptioncombo',
    },
    {
        key: 'dataSetOrganisationUnitCategory',
        name: 'analytics_rs_datasetorganisationunitcategory',
    },
]

const ResourceTable = ({ sectionKey }) => {
    const { startResourceTablesGeneration, loading, error, notifications } =
        useResourceTables()

    return (
        <div>
            <PageHeader
                title={i18nKeys.resourceTables.title}
                sectionKey={sectionKey}
            />
            <Card className={styles.card}>
                {error && (
                    <NoticeBox className={styles.noticeBox} error>
                        {error.message}
                    </NoticeBox>
                )}
                <div className={styles.description}>
                    {tables.map((table) => (
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
                    onClick={startResourceTablesGeneration}
                    loading={loading}
                >
                    {loading
                        ? i18n.t('Generating tables...')
                        : i18n.t('Generate tables')}
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
