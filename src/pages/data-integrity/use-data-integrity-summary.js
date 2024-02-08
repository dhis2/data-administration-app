import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
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

export const useDataIntegritySummary = () => {
    const [lastJob, setLastJob] = React.useState(null)
    const { data: checks, loading: checksLoading } = useDataIntegrityChecks()
    const {
        data: summaryData,
        error: summaryError,
        refetch: fetchSummary,
    } = useDataQuery(summaryQuery)

    const { start, cancel, started: isPolling } = useLazyInterval(fetchSummary, 2000)
    const [runMutation, { loading: mutationLoading }] =
        useDataMutation(startDataIntegrityCheckMutation, {
            onComplete: (data) => {
                setLastJob(data.response)
                start()
            },
        })

    const startDataIntegrityCheck = useCallback(() => {
        setLastJob(null)
        runMutation()
}, [runMutation])

    const formattedData = useMemo(() => {
        if (!checks) {
            return
        }

        const mergedRunResult = summaryData ? mergeRunResult(checks, summaryData.result) : checks

        return mergedRunResult.map((check) => {
            if(check.isSlow) {
                return check
            }
            let loading = isPolling || mutationLoading
            if (check.runInfo && lastJob) {
                // if check was started after the last job was created, it was propably
                // started by last job
                const ranByLastJob =
                    check.runInfo.startTime >= lastJob.created
                loading = !ranByLastJob
            }
            return {
                ...check,
                loading
            }
        })
    }, [summaryData, checks, lastJob, isPolling, mutationLoading])

    useEffect(() => {
        if (summaryError || formattedData?.every((check) => !check.loading)) {
            cancel()
        }
    }, [summaryError, formattedData, cancel])

    return {
        startDataIntegrityCheck,
        runningCheck: mutationLoading || isPolling,
        loadingChecks: checksLoading,
        loading: checksLoading,
        checks: formattedData,
    }
}
