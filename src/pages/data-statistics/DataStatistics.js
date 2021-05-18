import i18n from '@dhis2/d2-i18n'
import { Card, NoticeBox, CircularLoader, CenteredContent } from '@dhis2/ui'
import { getInstance as getD2Instance } from 'd2'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import styles from './DataStatistics.module.css'
import DataStatisticsTable from './DataStatisticsTable'

const OBJECT_COUNTS_KEY = 'objectCounts'
const ACTIVE_USERS_KEY = 'activeUsers'
const USER_INVITATIONS_KEY = 'userInvitations'
const DATA_VALUE_COUNT_KEY = 'dataValueCount'
const EVENT_COUNT_KEY = 'eventCount'
const PENDING_INVITATION_ALL_KEY = 'all'
const EXPIRED_INVITATION_KEY = 'expired'

const objectLabels = {
    indicator: i18n.t('Indicators'),
    period: i18n.t('Periods'),
    visualization: i18n.t('Visualization'),
    programStageInstance: i18n.t('Events'),
    organisationUnit: i18n.t('Organisation units'),
    validationRule: i18n.t('Validation rules'),
    dataValue: i18n.t('Data values'),
    program: i18n.t('Programs'),
    dataElement: i18n.t('Data elements'),
    organisationUnitGroup: i18n.t('Organisation unit groups'),
    trackedEntityInstance: i18n.t('Tracked entity instances'),
    reportTable: i18n.t('Pivot tables'),
    programInstance: i18n.t('Program instances'),
    indicatorType: i18n.t('Indicator types'),
    dataSet: i18n.t('Data sets'),
    userGroup: i18n.t('User groups'),
    user: i18n.t('Users'),
    map: i18n.t('Maps'),
    indicatorGroup: i18n.t('Indicator groups'),
    chart: i18n.t('Charts'),
    dataElementGroup: i18n.t('Data element groups'),
    dashboard: i18n.t('Dashboards'),
}

const TableCard = ({ label, elements }) => (
    <Card className={styles.card}>
        <DataStatisticsTable label={label} elements={elements} />
    </Card>
)

TableCard.propTypes = {
    elements: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
}

const translatedTimeLabelFromIntProperty = key => {
    const intProperty = parseInt(key, 10)
    if (intProperty === 1) {
        return i18n.t('Today')
    } else if (intProperty > 0) {
        return i18n.t('Last {{days}} days', {
            days: intProperty,
        })
    } else {
        return i18n.t('Last hour')
    }
}

const objectCountsTableFromResponse = objectCountsResponse => {
    if (!objectCountsResponse) {
        return null
    }

    return {
        label: i18n.t('Object type'),
        elements: Object.entries(objectCountsResponse).map(([key, count]) => ({
            label: objectLabels[key] || key,
            count,
        })),
    }
}

const activeUsersTableFromResponse = activeUsersResponse => {
    if (!activeUsersResponse) {
        return null
    }

    return {
        label: i18n.t('Users logged in'),
        elements: Object.entries(activeUsersResponse).map(([key, count]) => ({
            label: translatedTimeLabelFromIntProperty(key),
            count,
        })),
    }
}

const userInvitationsTableFromResponse = userInvitationsResponse => {
    if (!userInvitationsResponse) {
        return null
    }

    const userInvitationsTable = {
        label: i18n.t('User account invitations'),
        elements: [],
    }

    if (
        Object.hasOwnProperty.call(
            userInvitationsResponse,
            PENDING_INVITATION_ALL_KEY
        )
    ) {
        userInvitationsTable.elements.push({
            label: i18n.t('Pending invitations'),
            count: userInvitationsResponse[PENDING_INVITATION_ALL_KEY],
        })
    }

    if (
        Object.hasOwnProperty.call(
            userInvitationsResponse,
            EXPIRED_INVITATION_KEY
        )
    ) {
        userInvitationsTable.elements.push({
            label: i18n.t('Expired invitations'),
            count: userInvitationsResponse[EXPIRED_INVITATION_KEY],
        })
    }

    return userInvitationsTable
}

const dataValueCountsTableFromResponse = dataValueCountsResponse => {
    if (!dataValueCountsResponse) {
        return null
    }

    return {
        label: i18n.t('Data values'),
        elements: Object.entries(dataValueCountsResponse).map(
            ([key, count]) => ({
                label: translatedTimeLabelFromIntProperty(key),
                count,
            })
        ),
    }
}

const eventCountsTableFromResponse = eventCountsResponse => {
    if (!eventCountsResponse) {
        return null
    }

    return {
        label: i18n.t('Events'),
        elements: Object.entries(eventCountsResponse).map(([key, count]) => ({
            label: translatedTimeLabelFromIntProperty(key),
            count,
        })),
    }
}

class DataStatistics extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    constructor() {
        super()
        this.state = {
            loading: true,
            error: null,
            tables: null,
        }
    }

    loadDataStatistics = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()
        try {
            const response = await api.get('dataSummary')
            const tables = {
                [OBJECT_COUNTS_KEY]: objectCountsTableFromResponse(
                    response[OBJECT_COUNTS_KEY]
                ),
                [ACTIVE_USERS_KEY]: activeUsersTableFromResponse(
                    response[ACTIVE_USERS_KEY]
                ),
                [USER_INVITATIONS_KEY]: userInvitationsTableFromResponse(
                    response[USER_INVITATIONS_KEY]
                ),
                [DATA_VALUE_COUNT_KEY]: dataValueCountsTableFromResponse(
                    response[DATA_VALUE_COUNT_KEY]
                ),
                [EVENT_COUNT_KEY]: eventCountsTableFromResponse(
                    response[EVENT_COUNT_KEY]
                ),
            }
            this.setState({
                loading: false,
                tables,
            })
        } catch (error) {
            this.setState({
                loading: false,
                error: error.message || i18n.t('Error loading data statistics'),
            })
        }
    }

    componentDidMount() {
        this.loadDataStatistics()
    }

    renderTable(key) {
        if (!this.state.tables[key]) {
            return null
        }

        return (
            <TableCard
                key={key}
                label={this.state.tables[key].label}
                elements={this.state.tables[key].elements}
            />
        )
    }

    renderTables() {
        if (Object.keys(this.state.tables).length === 0) {
            return <em>{i18n.t('No data statistics to show.')}</em>
        }

        return (
            <div className="row">
                <div className="col-md-6">
                    {this.renderTable(OBJECT_COUNTS_KEY)}
                </div>
                <div className="col-md-6">
                    {this.renderTable(USER_INVITATIONS_KEY)}
                    {this.renderTable(DATA_VALUE_COUNT_KEY)}
                    {this.renderTable(EVENT_COUNT_KEY)}
                    {this.renderTable(ACTIVE_USERS_KEY)}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <PageHeader
                    sectionKey={this.props.sectionKey}
                    title={i18nKeys.dataStatistics.title}
                />
                {this.state.error ? (
                    <NoticeBox error>{this.state.error}</NoticeBox>
                ) : this.state.loading ? (
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                ) : (
                    this.renderTables()
                )}
            </div>
        )
    }
}

export default DataStatistics
