import React, { useEffect } from 'react'
import css from './CheckDetails.module.css'
import cx from 'classnames'
import { Button, CircularLoader, IconRedo16, NoticeBox } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Notice } from './LoadingNotice.js'
import { useDataIntegrityDetails } from './use-data-integrity-details.js'
import {
    getDurationWithUnit,
    getDurationWithUnitFromDelta,
    getRelativeTime,
    getRelativeTimeFromDelta,
} from '../../../utils/relativeTime.js'
import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { StatusIcon } from '../list/StatusIcon.js'

export const CheckDetails = ({ check }) => {
    const { startDetailsCheck, runningCheck, loading, details, currentJob } =
        useDataIntegrityDetails(check.name)

    useEffect(() => {
        console.log({ loading, details })
        if (!loading && !details) {
            console.log({ startDetailsCheck })
            startDetailsCheck({ name: check.name })
        }
    }, [loading, details, check.name])

    return (
        <div className={css.wrapper}>
            <div className={css.top}>
                <DetailsHeader
                    name={check.displayName}
                    description={check.description}
                />
                <Button icon={<IconRedo16 />} onClick={startDetailsCheck}>
                    {i18n.t('Re-run')}
                </Button>
            </div>

            <div className={css.detailsRunWrapper}>
                <DetailsRun
                    summaryCheck={check}
                    detailsCheck={details}
                    runningCheck={runningCheck}
                    currentJob={currentJob}
                />
            </div>
        </div>
    )
}

export const DetailsHeader = ({ name, description }) => {
    return (
        <header>
            <h2>{name}</h2>
            <p>{description}</p>
        </header>
    )
}

const DetailsRun = ({
    detailsCheck,
    summaryCheck,
    runningCheck,
    currentJob,
}) => {
    // We dont have data for details at all
    if (!detailsCheck && !runningCheck) {
        return <CircularLoader />
    }
    if (runningCheck && currentJob) {
        return (
            <DetailsRunLoading
                detailsCheck={detailsCheck}
                summaryCheck={summaryCheck}
                runningCheck={runningCheck}
                currentJob={currentJob}
            />
        )
    }
    if (!detailsCheck) {
        // this shouldn't really happen
        return <div>No details loaded</div>
    }
    return <DetailsRunCompleted detailsCheck={detailsCheck} />
}

const DetailsRunCompleted = ({ detailsCheck }) => {
    const { fromServerDate } = useTimeZoneConversion()

    const latestRun = fromServerDate(
        detailsCheck.finishedTime
    ).toLocaleTimeString()

    const durationMs =
        fromServerDate(detailsCheck.finishedTime).getTime() -
        fromServerDate(detailsCheck.startTime).getTime()

    return (
        <div className={css.runCompletedWrapper}>
            <header>
                {i18n.t('Latest run completed {{time}}', {
                    time: latestRun,
                })}
                <StatusIcon count={detailsCheck.issues.length} />
            </header>
            <div className={css.runCompletedContent}>
                {detailsCheck.issues.length === 0 ? (
                    <DetailsRunSuccess />
                ) : (
                    <DetailsRunIssues detailsCheck={detailsCheck} />
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

const DetailsRunIssues = ({ detailsCheck }) => {
    const numberOfErrors = detailsCheck.issues.length
    return (
        <Notice
            title={i18n.t('{{ numberOfErrors }} errors', { numberOfErrors })}
            status="error"
        >
            <ul className={css.issuesList}>
                {detailsCheck.issues.map((issue) => {
                    const idInNameIndex = issue.name.lastIndexOf(':')
                    const name =
                        idInNameIndex !== -1
                            ? issue.name.substring(0, idInNameIndex)
                            : issue.name
                    const id = issue.id
               
                    return <li key={id || name}>{issue.name}</li>
                })}
            </ul>
        </Notice>
    )
}

const DetailsRunSuccess = () => {
    return <Notice status={'success'}>{i18n.t('Passed with 0 errors.')}</Notice>
}

const DetailsRunLoading = ({
    detailsCheck,
    summaryCheck,
    runningCheck,
    currentJob,
}) => {
    const { fromServerDate } = useTimeZoneConversion()
    if (runningCheck && currentJob) {
        const previousRun = detailsCheck || summaryCheck?.runInfo
        const jobStartedDate = fromServerDate(currentJob.created)
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
    return <div>hello</div>
}
