import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useRef } from 'react'
import css from './CheckDetails.module.css'
import { CheckInfo } from './CheckInfo.js'
import { checkProps } from './checkProps.js'
import { CheckRunContent } from './CheckRunContent.js'
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
    }, [loading, details, runningCheck, check.name, error, startDetailsCheck])

    return (
        <div className={css.wrapper}>
            <CheckInfo
                check={check}
                disableRun={runningCheck | loading}
                onStartDetailsCheck={() =>
                    startDetailsCheck({ name: check.name })
                }
            />

            <div className={css.detailsRunWrapper}>
                {error ? (
                    <DetailsError />
                ) : (
                    <CheckRunContent
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

const DetailsError = () => {
    return (
        <Notice status="error">
            {i18n.t('An error occurred when running the job')}
        </Notice>
    )
}
