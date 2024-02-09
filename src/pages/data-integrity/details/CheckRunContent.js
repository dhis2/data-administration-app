import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    getDurationWithUnitFromDelta
} from '../../../utils/relativeTime.js'
import { checkProps } from './checkProps.js'
import { CheckRunCompleted } from './CheckRunCompleted.js'
import { Notice } from './Notice.js'

export const CheckRunContent = ({
    detailsCheck,
    summaryCheck,
    runningCheck,
    currentJob,
}) => {
    if (runningCheck) {
        return (
            <DetailsRunLoading
                detailsCheck={detailsCheck}
                summaryCheck={summaryCheck}
                runningCheck={runningCheck}
                currentJob={currentJob}
            />
        )
    }

    // We dont have data for details at all
    if (!detailsCheck) {
        return <Notice status={'loading'} title={i18n.t('Loading')} />
    }

    return <CheckRunCompleted detailsCheck={detailsCheck} />
}

CheckRunContent.propTypes = {
    currentJob: PropTypes.object,
    detailsCheck: checkProps,
    runningCheck: PropTypes.bool,
    summaryCheck: checkProps,
}


const DetailsRunLoading = ({ detailsCheck, summaryCheck, currentJob }) => {
    const [, setTime] = useState(Date.now())

    useEffect(() => {
        // keep the progress timer updated
        const interval = setInterval(() => setTime(Date.now()), 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const { fromServerDate } = useTimeZoneConversion()
    const previousRun = detailsCheck || summaryCheck?.runInfo
    const jobStartedDate = fromServerDate(currentJob?.created)
    const jobDurationDelta = new Date().getTime() - jobStartedDate.getTime()

    const checkInProgressString =
        jobDurationDelta < 1000
            ? i18n.t('Check in progress')
            : i18n.t('Check in progress for {{time}}', {
                  time: getDurationWithUnitFromDelta(jobDurationDelta),
              })

    return (
        <Notice status="loading" title={checkInProgressString}>
            {previousRun?.averageExecutionTime
                ? i18n.t('Average execution time: {{ time }}', {
                      time: getDurationWithUnitFromDelta(
                          previousRun.averageExecutionTime
                      ),
                  })
                : null}
        </Notice>
    )
}

DetailsRunLoading.propTypes = {
    currentJob: PropTypes.object,
    detailsCheck: checkProps,
    summaryCheck: checkProps,
}