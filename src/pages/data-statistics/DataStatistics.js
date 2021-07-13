import { useDataQuery } from '@dhis2/app-runtime'
import { Card, NoticeBox, CircularLoader, CenteredContent } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import styles from './DataStatistics.module.css'
import DataStatisticsTable from './DataStatisticsTable'
import { parseTables } from './parse-tables'
import {
    OBJECT_COUNTS_KEY,
    ACTIVE_USERS_KEY,
    USER_INVITATIONS_KEY,
    DATA_VALUE_COUNT_KEY,
    EVENT_COUNT_KEY,
} from './table-keys'

const TableCard = ({ label, elements }) => (
    <Card className={styles.card}>
        <DataStatisticsTable label={label} elements={elements} />
    </Card>
)

TableCard.propTypes = {
    elements: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
}

const query = {
    dataSummary: {
        resource: 'dataSummary',
    },
}

const DataStatistics = ({ sectionKey }) => {
    const { loading, error, data } = useDataQuery(query)

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

    const tables = parseTables(data.dataSummary)
    const renderTable = key => {
        if (tables[key] === null) {
            return null
        }

        return (
            <TableCard
                label={tables[key].label}
                elements={tables[key].elements}
            />
        )
    }

    return (
        <>
            <PageHeader
                sectionKey={sectionKey}
                title={i18nKeys.dataStatistics.title}
            />
            <div className="row">
                <div className="col-md-6">{renderTable(OBJECT_COUNTS_KEY)}</div>
                <div className="col-md-6">
                    {renderTable(USER_INVITATIONS_KEY)}
                    {renderTable(DATA_VALUE_COUNT_KEY)}
                    {renderTable(EVENT_COUNT_KEY)}
                    {renderTable(ACTIVE_USERS_KEY)}
                </div>
            </div>
        </>
    )
}

DataStatistics.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataStatistics
