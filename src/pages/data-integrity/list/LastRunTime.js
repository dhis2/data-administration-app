import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { getRelativeTime } from '../../../utils/relativeTime.js'

export const LastRunTime = ({ className, value }) => {
    const { fromServerDate } = useTimeZoneConversion()

    const clientDate = fromServerDate(value)

    if (!value) {
        return null
    }

    return (
        <span
            className={className}
            title={clientDate.getClientZonedISOString()}
        >
            {i18n.t('Last run {{time}}', { time: getRelativeTime(clientDate) })}
        </span>
    )
}
