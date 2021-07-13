import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    resource: 'system/tasks/ANALYTICS_TABLE',
    id: ({ jobId }) => jobId,
}

export const useAnalyticsPoll = () =>
    usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: data => data.some(t => t.completed),
    })
