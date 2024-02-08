import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect, useMemo, useCallback } from 'react'
import { useLazyInterval } from '../../../hooks/use-poll.js'

const detailsQuery = {
    result: {
        resource: 'dataIntegrity/details',
        params: ({ name, timeout }) => ({
            checks: name,
            /* API supports timeout, which enables "long-polling", and means we have to poll less
            Note that this is not enabled on the request that runs on mount 
            - which is used to check if we have initial data */
            timeout,
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
        started: isPolling,
    } = useLazyInterval(fetchDetails, 500) // low due to long-polling
    const [runMutation, { loading: mutationLoading }] =
        useDataMutation(startDetailsCheckMutation, {
            variables: { name },
            onComplete: (data) => {
                setLastJob(data.response)
                start({ name, timeout: 5000 })
            },
        })

    const startDetailsCheck = useCallback(() => {
        runMutation()
    }, [runMutation])

    const details = detailsData?.result?.[name]

    useEffect(() => {
        if(!isPolling) {
            return
        }
        const ranByLastJob = details?.startTime >= lastJob?.created
        if (detailsError || ranByLastJob || lastJob == null) {
            cancel()
        }
    }, [detailsError, details, lastJob, name, cancel, isPolling])

    return {
        startDetailsCheck,
        runningCheck: mutationLoading || isPolling,
        loading: detailsLoading,
        details: details,
        currentJob: isPolling ? lastJob : null,
    }
}
