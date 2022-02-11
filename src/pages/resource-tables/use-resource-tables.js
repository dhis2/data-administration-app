import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { getActiveTaskIdFromSummary } from '../../get-active-task-id-from-summary'
import { getUpdatedNotifications } from '../../get-updated-notifications'
import { usePoll } from '../../hooks/use-poll'

const pollQuery = {
    resource: 'system/tasks/RESOURCE_TABLE',
    id: ({ taskId }) => taskId,
}

const startResourceTablesGenerationMutation = {
    resource: 'resourceTables',
    type: 'create',
}

const existingTasksQuery = {
    tasks: {
        resource: 'system/tasks/RESOURCE_TABLE',
    },
}

export const useResourceTables = () => {
    const poll = usePoll({
        query: pollQuery,
        interval: 3000,
        checkDone: data => data[0].completed,
    })
    const { loading: loadingExistingTask } = useDataQuery(existingTasksQuery, {
        onComplete: data => {
            const taskId = getActiveTaskIdFromSummary(data.tasks)
            if (taskId) {
                poll.start({ taskId })
            }
        },
    })
    const [startResourceTablesGeneration, { loading, error }] = useDataMutation(
        startResourceTablesGenerationMutation,
        {
            onComplete: data => {
                const { id: taskId } = data.response
                poll.start({ taskId })
            },
        }
    )

    return {
        startResourceTablesGeneration,
        loading: loading || loadingExistingTask || poll.polling,
        error: error || poll.error,
        notifications: poll.data ? getUpdatedNotifications(poll.data) : [],
    }
}
