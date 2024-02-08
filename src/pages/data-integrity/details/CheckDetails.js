import { useConfig, useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, IconSync16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import {
    getDurationWithUnitFromDelta,
    selectedLocale,
} from '../../../utils/relativeTime.js'
import { StatusIcon } from '../list/StatusIcon.js'
import css from './CheckDetails.module.css'
import { CheckIssues } from './CheckIssues.js'
import { checkProps } from './checkProps.js'
import { Notice } from './Notice.js'
import { useDataIntegrityDetails } from './use-data-integrity-details.js'

export const CheckDetails = ({ check }) => {
    // make sure detailsCheck is only started once
    const hasStartedCheck = useRef(false)
    const {
        startDetailsCheck,
        runningCheck,
        loading,
        details,
        currentJob,
        error,
    } = useDataIntegrityDetails(check.name)

    useEffect(() => {
        if (
            !loading &&
            !details &&
            !runningCheck &&
            !error &&
            !hasStartedCheck.current
        ) {
            hasStartedCheck.current = true
            startDetailsCheck({ name: check.name })
        }
    }, [
        loading,
        details,
        runningCheck,
        check.name,
        error,
        startDetailsCheck,
    ])

    return (
        <div className={css.wrapper}>
            <div className={css.top}>
                <DetailsHeader
                    name={check.displayName}
                    description={check.description}
                />
                <Button
                    disabled={runningCheck || loading}
                    icon={<IconSync16 />}
                    onClick={startDetailsCheck}
                >
                    {i18n.t('Re-run')}
                </Button>
            </div>

            <div className={css.detailsRunWrapper}>
                {error ? (
                    <DetailsError />
                ) : (
                    <DetailsContent
                        summaryCheck={check}
                        detailsCheck={details}
                        runningCheck={runningCheck}
                        currentJob={currentJob}
                    />
                )}
            </div>
        </div>
    )
}

CheckDetails.propTypes = {
    check: checkProps,
}

export const DetailsHeader = ({ name, description }) => {
    return (
        <header>
            <h2>{name}</h2>
            <p>{description}</p>
        </header>
    )
}

DetailsHeader.propTypes = {}

const DetailsContent = ({
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

const DetailsError = () => {
    return (
        <Notice status="error">
            {i18n.t('An error occurred when running the job')}
        </Notice>
    )
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
