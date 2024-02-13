import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import css from './CheckDetails.module.css'
import { CheckInfo } from './CheckInfo.js'
import { checkProps } from './checkProps.js'
import { CheckRunContent } from './CheckRunContent.js'
import { Notice } from './Notice.js'
import { useDataIntegrityDetails } from './use-data-integrity-details.js'

export const CheckDetails = ({ check }) => {
    // make sure detailsCheck is only started once
    const {
        startDetailsCheck,
        runningCheck,
        loading,
        details,
        currentJob,
        error,
        hasRunCheck,
    } = useDataIntegrityDetails(check.name)

    const shouldRunCheck =
        !check.isSlow &&
        !loading &&
        !details &&
        !runningCheck &&
        !error &&
        !hasRunCheck

    useEffect(() => {
        if (shouldRunCheck) {
            startDetailsCheck({ name: check.name })
        }
    }, [shouldRunCheck, check.name, startDetailsCheck])

    return (
        <div className={css.wrapper}>
            <CheckInfo
                check={check}
                hasRunCheck={hasRunCheck}
                disableRunButton={runningCheck || loading}
                onStartDetailsCheck={() =>
                    startDetailsCheck({ name: check.name })
                }
            />

            <div className={css.detailsRunWrapper}>
                {error ? (
                    <DetailsError />
                ) : (
                    <CheckRunContent
                        check={check}
                        detailsCheck={details}
                        runningCheck={runningCheck}
                        currentJob={currentJob}
                        hasRunCheck={hasRunCheck}
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
