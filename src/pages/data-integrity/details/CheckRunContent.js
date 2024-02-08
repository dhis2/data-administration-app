import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    getDurationWithUnitFromDelta,
    selectedLocale,
} from '../../../utils/relativeTime.js'
import { StatusIcon } from '../list/StatusIcon.js'
import css from './CheckDetails.module.css'
import { CheckIssues } from './CheckIssues.js'
import { checkProps } from './checkProps.js'
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

    return <DetailsRunCompleted detailsCheck={detailsCheck} />
}

CheckRunContent.propTypes = {
    currentJob: PropTypes.object,
    detailsCheck: checkProps,
    runningCheck: PropTypes.bool,
    summaryCheck: checkProps,
}

const DetailsRunCompleted = ({ detailsCheck }) => {
    const { fromServerDate } = useTimeZoneConversion()

    const latestRun = fromServerDate(detailsCheck.finishedTime)

    const formattedLatestRun = Intl.DateTimeFormat([selectedLocale], {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(latestRun)

    const durationMs =
        fromServerDate(detailsCheck.finishedTime).getTime() -
        fromServerDate(detailsCheck.startTime).getTime()

    return (
        <div className={css.runCompletedWrapper}>
            <header title={latestRun.getClientZonedISOString()}>
                {i18n.t('Latest run completed {{time}}', {
                    time: formattedLatestRun,
                    interpolation: { escapeValue: false },
                })}
                <StatusIcon count={detailsCheck.issues.length} />
            </header>
            <div className={css.runCompletedContent}>
                {detailsCheck.issues.length === 0 ? (
                    <DetailsRunSuccess />
                ) : (
                    <CheckIssues detailsCheck={detailsCheck} />
                )}
                <div className={css.completedTime}>
                    {i18n.t('Completed in {{time}}', {
                        time: getDurationWithUnitFromDelta(durationMs),
                    })}
                </div>
            </div>
        </div>
    )
}

DetailsRunCompleted.propTypes = {
    detailsCheck: checkProps,
}

const DetailsRunSuccess = () => {
    return <Notice status={'success'}>{i18n.t('Passed with 0 errors.')}</Notice>
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