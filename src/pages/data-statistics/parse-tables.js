import i18n from '@dhis2/d2-i18n'
import {
    OBJECT_COUNTS_KEY,
    ACTIVE_USERS_KEY,
    USER_INVITATIONS_KEY,
    DATA_VALUE_COUNT_KEY,
    EVENT_COUNT_KEY,
    PENDING_INVITATION_ALL_KEY,
    EXPIRED_INVITATION_KEY,
} from './table-keys.js'

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
    eventVisualization: i18n.t('Event visualization'),
}

const translatedTimeLabelFromIntProperty = (key) => {
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

const objectCountsTableFromResponse = (objectCountsResponse) => {
    if (!objectCountsResponse) {
        return null
    }

    const elements = Object.entries(objectCountsResponse).map(
        ([key, count]) => ({
            label: objectLabels[key] || key,
            count,
        })
    )
    elements.sort((a, b) => a.label.localeCompare(b.label))

    return {
        label: i18n.t('Object type'),
        elements,
    }
}

const activeUsersTableFromResponse = (activeUsersResponse) => {
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

const userInvitationsTableFromResponse = (userInvitationsResponse) => {
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

const dataValueCountsTableFromResponse = (dataValueCountsResponse) => {
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

const eventCountsTableFromResponse = (eventCountsResponse) => {
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

export const parseTables = (response) => ({
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
    [EVENT_COUNT_KEY]: eventCountsTableFromResponse(response[EVENT_COUNT_KEY]),
})
