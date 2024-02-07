import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import React, { useMemo, useEffect } from 'react'
import { useLazyInterval } from '../../hooks/use-poll.js'
import { useDataIntegrityChecks } from './use-data-integrity-checks.js'

const startDataIntegrityCheckMutation = {
    resource: 'dataIntegrity/summary',
    type: 'create',
}

const runSummaryQuery = {
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
        loading: summaryLoading,
        error: summaryError,
        refetch: fetchSummary,
    } = useDataQuery(runSummaryQuery)



    const { start, cancel, started } = useLazyInterval(fetchSummary, 3000)
    const [startDataIntegrityCheck, { loading: mutationLoading, error, data }] =
        useDataMutation(startDataIntegrityCheckMutation, {
            onComplete: (data) => {
                setLastJob(data.response)
                start()
            },
        })

    const formattedData = useMemo(() => {
        if (!summaryData || !checks) {return}

        const mergedRunResult = mergeRunResult(checks, summaryData.result)

        return mergedRunResult.map((check) => {
            if (check.runInfo && lastJob) {
                // if check was started after the last job was created, it was propably 
                // started by last job
                const probablyThisJob =
                    check.runInfo.startTime >= lastJob.created
                // loading if not slow and if we dont have data for last job
                check.loading = !check.isSlow && !probablyThisJob
            }
        
            return check
        })
    }, [summaryData, checks, lastJob])

    useEffect(() => {
        if(summaryError || formattedData?.every((check) => !check.loading)) {
            cancel()
        }
    }, [summaryError, formattedData, cancel])

    return {
        startDataIntegrityCheck,
        runningCheck: mutationLoading || started,
        loadingChecks: checksLoading,
        loading: checksLoading, // || isPolling,
        //error: error || poll.error,
        // issues: !isPolling && poll.data,
        checks: formattedData,
    }
}
