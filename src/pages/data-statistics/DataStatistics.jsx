import { useDataQuery, useConfig } from '@dhis2/app-runtime'
import { Card, NoticeBox, CircularLoader, CenteredContent } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { i18nKeys } from '../../i18n-keys.js'
import styles from './DataStatistics.module.css'
import DataStatisticsTable from './DataStatisticsTable.jsx'
import { parseTables } from './parse-tables.js'
import {
    OBJECT_COUNTS_KEY,
    ACTIVE_USERS_KEY,
    USER_INVITATIONS_KEY,
    DATA_VALUE_COUNT_KEY,
    EVENT_COUNT_KEY,
    LOGGED_IN_USERS_KEY,
} from './table-keys.js'

const TableCard = ({ label, description, elements }) => (
    <Card className={styles.card}>
        <DataStatisticsTable
            label={label}
            elements={elements}
            description={description}
        />
    </Card>
)

TableCard.propTypes = {
    elements: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
}

const query = {
    dataSummary: {
        resource: 'dataSummary',
    },
}

const DataStatistics = ({ sectionKey }) => {
    const { loading, error, data } = useDataQuery(query)
    const { apiVersion } = useConfig()
    const activeUsersAreLoggedInUsers = parseInt(apiVersion) <= 42

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox error>{error.message}</NoticeBox>
            </CenteredContent>
        )
    }

    const tables = parseTables(data.dataSummary, {
        activeUsersAreLoggedInUsers,
    })
    const renderTable = (key) => {
        if (tables[key] === null) {
            return null
        }

        return (
            <TableCard
                label={tables[key].label}
                elements={tables[key].elements}
                description={tables[key]?.description}
            />
        )
    }

    return (
        <>
            <PageHeader
                sectionKey={sectionKey}
                title={i18nKeys.dataStatistics.title}
            />
            <div className={styles.tablesGrid}>
                <div>{renderTable(OBJECT_COUNTS_KEY)}</div>
                <div>
                    {renderTable(USER_INVITATIONS_KEY)}
                    {renderTable(DATA_VALUE_COUNT_KEY)}
                    {renderTable(EVENT_COUNT_KEY)}
                    {renderTable(ACTIVE_USERS_KEY)}
                    {renderTable(LOGGED_IN_USERS_KEY)}
                </div>
            </div>
        </>
    )
}

DataStatistics.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataStatistics
