import { useTimeZoneConversion } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
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
            {getRelativeTime(clientDate)}
        </span>
    )
}

LastRunTime.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
}
