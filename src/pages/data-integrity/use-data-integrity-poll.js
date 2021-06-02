import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    poll: {
        resource: 'system/taskSummaries/DATA_INTEGRITY',
        id: ({ jobId }) => jobId,
    },
}

export const useDataIntegrityPoll = () => {
    const { refetch, error, data } = useDataQuery(pollQuery, { lazy: true })
    const PULL_INTERVAL = 3000
    const poll = usePoll(jobId => {
        refetch({ jobId })
    }, PULL_INTERVAL)

    useEffect(() => {
        if (data?.poll) {
            poll.cancel()
        }
    }, [data])

    return {
        ...poll,
        error,
        data: data?.poll,
    }
}
