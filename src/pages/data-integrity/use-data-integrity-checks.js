import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import React, { useState, useMemo } from 'react'
import { usePoll } from '../../hooks/use-poll.js'

const dataIntegrityChecksQuery = {
    allChecks: {
        resource: 'dataIntegrity',
    },
    runSummary: {
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

export const useDataIntegrityChecks = () => {
    // grabs the the entire list of checks
    const { data, loading } = useDataQuery(dataIntegrityChecksQuery)

    const formattedData = useMemo(
        () => data && mergeRunResult(data?.allChecks, data?.runSummary),
        [data]
    )
    // grab run-info for checks

    return {
        checks: formattedData,
        loading: loading,
    }
}
