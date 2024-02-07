import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect, useMemo, useCallback } from 'react'
import { useLazyInterval } from '../../../hooks/use-poll.js'

const detailsQuery = {
    result: {
        resource: 'dataIntegrity/details',
        params: ({ name }) => ({
            checks: name,
        }),
    },
}

const startDetailsCheckMutation = {
    resource: 'dataIntegrity/details',
    type: 'create',
    params: ({ name }) => ({ checks: name }),
}

export const useDataIntegrityDetails = (name) => {
    const [lastJob, setLastJob] = React.useState(null)
    const {
        data: detailsData,
        loading: detailsLoading,
        error: detailsError,
        refetch: fetchDetails,
    } = useDataQuery(detailsQuery, { variables: { name } })

    const {
        start,
        cancel,
        started: startedPolling,
    } = useLazyInterval(fetchDetails, 1000)
    const [runMutation, { loading: mutationLoading, error, data }] =
        useDataMutation(startDetailsCheckMutation, {
            variables: { name },
            onComplete: (data) => {
                setLastJob(data.response)
                start({ name })
            },
        })

    const startDetailsCheck = useCallback(() => {
        runMutation()
    }, [runMutation])

    const formattedData = useMemo(() => {
        if (!detailsData?.result) {return}
        return detailsData.result[name]
    }, [detailsData])

    useEffect(() => {
        console.log('Got result', { formattedData, lastJob })
        const didLoadDataForJob = formattedData?.startTime >= lastJob?.created
        console.log({didLoadDataForJob})
        if (detailsError || didLoadDataForJob) {
            cancel()
        }
    }, [detailsError, formattedData, lastJob])

    console.log({mutationLoading, startedPolling, detailsLoading, formattedData, lastJob})
    return {
        startDetailsCheck,
        runningCheck: mutationLoading || startedPolling,
        loading: detailsLoading,
        details: formattedData,
        currentJob: startedPolling ? lastJob : null,
    }
}
