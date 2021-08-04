import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    resource: 'system/tasks/RESOURCE_TABLE',
    id: ({ jobId }) => jobId,
}

export const useResourceTablesPoll = () =>
    usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: data => data.some(t => t.completed),
    })
