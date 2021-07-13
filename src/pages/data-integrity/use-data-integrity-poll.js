import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    resource: 'system/taskSummaries/DATA_INTEGRITY',
    id: ({ jobId }) => jobId,
}

export const useDataIntegrityPoll = () =>
    usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: data => data,
    })
