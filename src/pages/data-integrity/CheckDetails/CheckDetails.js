import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, IconSync16 } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { getDurationWithUnitFromDelta } from '../../../utils/relativeTime.js'
import { StatusIcon } from '../list/StatusIcon.js'
import css from './CheckDetails.module.css'
import { Notice } from './Notice.js'
import { useDataIntegrityDetails } from './use-data-integrity-details.js'

export const CheckDetails = ({ check }) => {
    const { startDetailsCheck, runningCheck, loading, details, currentJob } =
        useDataIntegrityDetails(check.name)

    useEffect(() => {
        if (!loading && !details) {
            startDetailsCheck({ name: check.name })
        }
    }, [loading, details, check.name, startDetailsCheck])

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
    if (!detailsCheck) {
        return <Notice status={'loading'} title={i18n.t('Loading')} />
    }

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

                    return <li key={id || issue.name}>{issue.name}</li>
                })}
            </ul>
        </Notice>
    )
}

const DetailsRunSuccess = () => {
    return <Notice status={'success'}>{i18n.t('Passed with 0 errors.')}</Notice>
}

const DetailsRunLoading = ({ detailsCheck, summaryCheck, currentJob }) => {
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
