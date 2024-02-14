import { useAlert, useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useMemo, useEffect, useCallback } from 'react'
import { useLazyInterval } from '../../hooks/use-poll.js'
import { useDataIntegrityChecks } from './use-data-integrity-checks.js'

const startDataIntegrityCheckMutation = {
    resource: 'dataIntegrity/summary',
    type: 'create',
}

const summaryQuery = {
    result: {
        resource: 'dataIntegrity/summary',
    },
}

const mergeRunResult = (checks, runSummary) => {
    if (!checks || !runSummary) {
        return []
    }

    return checks.map((check) => {
        const summaryInfo = runSummary[check.name]
        // runInfo contains most of the same props as check, pick only the relevant ones
        const runInfo = {
            count: summaryInfo?.count,
            percentage: summaryInfo?.percentage,
            finishedTime: summaryInfo?.finishedTime,
            startTime: summaryInfo?.startTime,
        }
        return { ...check, runInfo: runInfo }
    })
}

/**
 * Handles fetching data integrity summary data (the data in list view).
 *
 * Fetches all the checks - for displaying the list of checks regardless if summary is available.
 * Fetches the summary checks on mount - to get summary data if already available.
 * Merges the result of the checks and the summary data.
 *
 * Also handles starting and polling the summary data. Polling is completed when all checks
 * have startTime > lastJob.created, or when there is an error.
 *
 */
export const useDataIntegritySummary = () => {
    const [lastJob, setLastJob] = React.useState(null)
    const { show: showFailedToRunError, hide: hideFailedToRunError } = useAlert(
        i18n.t('Failed to run integrity check'),
        { critical: true }
    )
    const {
        data: checks,
        loading: checksLoading,
        error: checksError,
    } = useDataIntegrityChecks()
    const {
        data: summaryData,
        error: summaryError,
        refetch: fetchSummary,
    } = useDataQuery(summaryQuery)

    const {
        start,
        cancel,
        started: isPolling,
    } = useLazyInterval(fetchSummary, 3000)
    const [runMutation, { loading: mutationLoading, error: mutationError }] =
        useDataMutation(startDataIntegrityCheckMutation, {
            onComplete: (data) => {
                setLastJob(data.response)
                if (data?.response.created) {
                    start()
                }
            },
            onError: (err) => {
                console.error(err)
                showFailedToRunError()
            },
        })

    const startDataIntegrityCheck = useCallback(() => {
        hideFailedToRunError()
        setLastJob(null)
        runMutation()
    }, [runMutation, hideFailedToRunError])

    const formattedData = useMemo(() => {
        if (!checks) {
            return
        }

        const mergedRunResult = summaryData
            ? mergeRunResult(checks, summaryData.result)
            : checks

        return mergedRunResult.map((check) => {
            // ignore slow checks, because they are not started by summary
            let loading = !check.isSlow && (isPolling || mutationLoading)
            if (!check.isSlow && check.runInfo && lastJob) {
                // if check was started after the last job was created, it was propably
                // started by last job
                const ranByLastJob = check.runInfo.startTime >= lastJob.created
                loading = !ranByLastJob
            }
            return { ...check, loading }
        })
    }, [summaryData, checks, lastJob, isPolling, mutationLoading])

    const anyError = summaryError || mutationError
    useEffect(() => {
        const isFinished = formattedData?.every((check) => !check.loading)

        if (anyError || isFinished) {
            cancel()
        }
    }, [anyError, formattedData, cancel])

    return {
        startDataIntegrityCheck,
        runningCheck: mutationLoading || isPolling,
        loading: checksLoading,
        checks: formattedData,
        checksError,
    }
}
