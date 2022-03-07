import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    resource: 'system/taskSummaries/DATA_INTEGRITY',
    id: ({ jobId }) => jobId,
}

export const useDataIntegrityPoll = () =>
    usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: data => {
            // On 2.37 and 2.38, an empty HTTP response is sent instead of `null`
            if (data instanceof Blob && data.size === 0) {
                return false
            }
            return data
        },
    })
