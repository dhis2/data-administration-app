import { useDataMutation } from '@dhis2/app-runtime'
import { usePoll } from '../../hooks/use-poll.js'

const startDataIntegrityCheckMutation = {
    resource: 'dataIntegrity',
    type: 'create',
}

const pollQuery = {
    resource: 'system/taskSummaries/DATA_INTEGRITY',
    id: ({ jobId }) => jobId,
}

export const useDataIntegrity = () => {
    const poll = usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: (data) => {
            // On 2.37 and 2.38, an empty HTTP response is sent instead of `null`
            if (data instanceof Blob && data.size === 0) {
                return false
            }
            return data
        },
    })
    const [startDataIntegrityCheck, { loading, error }] = useDataMutation(
        startDataIntegrityCheckMutation,
        {
            onComplete: (data) => {
                const { id: jobId } = data.response
                poll.start({ jobId })
            },
        }
    )
    const isPolling = !poll.data || poll.data?.size === 0

    return {
        startDataIntegrityCheck,
        loading: loading || poll.polling,
        error: error || poll.error,
        issues: !isPolling && poll.data,
    }
}
