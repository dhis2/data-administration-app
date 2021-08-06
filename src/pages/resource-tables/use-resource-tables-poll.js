import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    resource: 'system/tasks/RESOURCE_TABLE',
    id: ({ taskId }) => taskId,
}

export const useResourceTablesPoll = () =>
    usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: data => data[0].completed,
    })
