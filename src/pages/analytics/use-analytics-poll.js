import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    poll: {
        resource: 'system/tasks/ANALYTICS_TABLE',
        id: ({ jobId }) => jobId,
    },
}

export const useAnalyticsPoll = () => {
    const { refetch, error, data } = useDataQuery(pollQuery, { lazy: true })
    const PULL_INTERVAL = 3000
    const poll = usePoll(jobId => {
        refetch({ jobId })
    }, PULL_INTERVAL)

    useEffect(() => {
        if (data?.poll.some(t => t.completed)) {
            poll.cancel()
        }
    }, [data])

    return {
        ...poll,
        error,
        data: data?.poll,
    }
}
