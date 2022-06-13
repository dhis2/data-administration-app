export const getActiveTaskIdFromSummary = (taskSummaryResponse) => {
    const { taskId } = Object.entries(taskSummaryResponse).reduce(
        (currLatestTask, [taskId, taskNotifications]) => {
            // First notification is last array item, so its timestamp represents the task start
            const firstTaskNotification =
                taskNotifications[taskNotifications.length - 1]
            const time = new Date(firstTaskNotification.time)

            if (!taskNotifications[0].completed && time > currLatestTask.time) {
                return { taskId, time }
            }

            return currLatestTask
        },
        {
            taskId: null,
            time: new Date(0),
        }
    )

    return taskId
}
