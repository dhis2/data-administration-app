import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconChevronDown24, IconChevronUp24, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    getDurationWithUnitFromDelta,
    selectedLocale,
} from '../../../utils/relativeTime.js'
import { StatusIcon } from '../list/StatusIcon.js'
import css from './CheckDetails.module.css'
import { CheckIssues } from './CheckIssues.js'
import { checkProps } from './checkProps.js'
import { Notice } from './Notice.js'

export const CheckRunCompleted = ({ detailsCheck }) => {
    const [expandSummary, setExpandSummary] = useState(true)

    const passed = detailsCheck.issues.length === 0

    return (
        <div className={css.runCompletedWrapper}>
            {!passed && (
                <Recommendation>{detailsCheck.recommendation}</Recommendation>
            )}
            <div
                className={css.completedTimeWrapper}
                onClick={() => setExpandSummary((prev) => !prev)}
            >
                <CompletedTime
                    finishedTime={detailsCheck.finishedTime}
                    issuesCount={detailsCheck.issues.length}
                    expanded={expandSummary}
                    setExp
                />
                {expandSummary ? <IconChevronUp24 /> : <IconChevronDown24 />}
            </div>
            {expandSummary && <RunSummary detailsCheck={detailsCheck} />}
        </div>
    )
}

CheckRunCompleted.propTypes = {
    detailsCheck: checkProps,
}

const RunSummary = ({ detailsCheck }) => {
    const jobDurationMs =
        new Date(detailsCheck.finishedTime).getTime() -
        new Date(detailsCheck.startTime).getTime()

    const passed = detailsCheck.issues.length === 0

    return (
        <div className={css.runSummary}>
            {passed ? (
                <CheckRunSuccess />
            ) : (
                <CheckIssues detailsCheck={detailsCheck} />
            )}
            <div className={css.completedDuration}>
                {i18n.t('Completed in {{time}}', {
                    time: getDurationWithUnitFromDelta(jobDurationMs),
                })}
            </div>
        </div>
    )
}

RunSummary.propTypes = {
    detailsCheck: checkProps,
}

const CompletedTime = ({ issuesCount, finishedTime }) => {
    const { fromServerDate } = useTimeZoneConversion()

    const latestRun = fromServerDate(finishedTime)
    const formattedLatestRun = Intl.DateTimeFormat([selectedLocale], {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(latestRun)

    return (
        <header title={latestRun.getClientZonedISOString()}>
            {i18n.t('Latest run completed {{time}}', {
                time: formattedLatestRun,
                interpolation: { escapeValue: false },
            })}
            <StatusIcon count={issuesCount} />
        </header>
    )
}

CompletedTime.propTypes = {
    finishedTime: PropTypes.string,
    issuesCount: PropTypes.number,
}

const CheckRunSuccess = () => {
    return <Notice status={'success'}>{i18n.t('Passed with 0 errors.')}</Notice>
}

const Recommendation = ({ children }) => (
    <NoticeBox title={i18n.t('Reccomendation')}>{children}</NoticeBox>
)

Recommendation.propTypes = {
    children: PropTypes.node,
}
