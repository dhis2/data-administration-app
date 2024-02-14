import { useAlert, useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useLazyInterval } from '../../../hooks/use-poll.js'
import { useAddCheckDetails } from '../checkDetailsStore.js'

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
    const [lastJob, setLastJob] = useState(null)
    const addCheck = useAddCheckDetails()

    const {
        data: detailsData,
        loading: detailsLoading,
        error: detailsError,
        refetch: fetchDetails,
        called: detailsCalled,
        fetching: detailsFetching,
    } = useDataQuery(detailsQuery, {
        variables: { name },
    })

    const {
        start,
        cancel,
        started: isPolling,
    } = useLazyInterval(fetchDetails, 500) // low due to long-polling

    const [
        runMutation,
        { loading: mutationLoading, error: mutationError, called },
    ] = useDataMutation(startDetailsCheckMutation, {
        variables: { name },
        onComplete: (data) => {
            setLastJob(data.response)
            if (data?.response?.created) {
                start({ name, timeout: 5000 })
            }
        },
    })

    const startDetailsCheck = useCallback(() => {
        setLastJob(null)
        runMutation()
    }, [runMutation])

    const details = detailsData?.result?.[name]
    const anyError = detailsError || mutationError

    // onComplete doesn't work because it's not called when
    // refetch gets data
    useEffect(() => {
        if (details) {
            addCheck(details)
        }
    }, [details, addCheck])

    useEffect(() => {
        if (!isPolling) {
            return
        }
        const ranByLastJob = details?.startTime >= lastJob?.created
        if (anyError || ranByLastJob || lastJob == null) {
            cancel()
        }
    }, [anyError, details, lastJob, name, cancel, isPolling])

    return {
        startDetailsCheck,
        runningCheck: mutationLoading || isPolling,
        loading: detailsLoading || detailsFetching,
        details: details,
        currentJob: isPolling ? lastJob : null,
        error: anyError,
        hasRunCheck: called || !!details,
        detailsCalled,
        detailsFetching,
    }
}
