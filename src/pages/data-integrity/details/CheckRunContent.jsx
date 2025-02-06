import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { getDurationWithUnitFromDelta } from '../../../utils/relativeTime.js'
import { checkProps } from './checkProps.js'
import { CheckRunCompleted } from './CheckRunCompleted.jsx'
import { Notice } from './Notice.jsx'

export const CheckRunContent = ({
    detailsCheck,
    check,
    runningCheck,
    currentJob,
}) => {
    if (runningCheck) {
        return (
            <DetailsRunLoading
                detailsCheck={detailsCheck}
                check={check}
                runningCheck={runningCheck}
                currentJob={currentJob}
            />
        )
    }

    if (!detailsCheck && check?.isSlow) {
        return (
            <NoticeBox title={i18n.t('Slow check')} warning>
                {i18n.t(
                    'This check is marked as slow, and you have to manually run it.'
                )}
            </NoticeBox>
        )
    }
    // We dont have data for details at all
    if (!detailsCheck) {
        return <Notice status={'loading'} title={i18n.t('Loading')} />
    }

    return <CheckRunCompleted detailsCheck={detailsCheck} />
}

CheckRunContent.propTypes = {
    check: checkProps,
    currentJob: PropTypes.object,
    detailsCheck: checkProps,
    runningCheck: PropTypes.bool,
}

const DetailsRunLoading = ({ detailsCheck, check, currentJob }) => {
    const [, setTime] = useState(Date.now())

    useEffect(() => {
        // keep the progress timer updated
        const interval = setInterval(() => setTime(Date.now()), 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const { fromServerDate } = useTimeZoneConversion()
    const previousRun = detailsCheck || check?.runInfo
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
                ? i18n.t('Average execution time: {{time}}', {
                      nsSeparator: '~',
                      time: getDurationWithUnitFromDelta(
                          previousRun.averageExecutionTime
                      ),
                  })
                : null}
        </Notice>
    )
}

DetailsRunLoading.propTypes = {
    check: checkProps,
    currentJob: PropTypes.object,
    detailsCheck: checkProps,
}
