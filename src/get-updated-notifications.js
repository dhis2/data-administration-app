export const getUpdatedNotifications = taskNotifications => {
    const lastIndex = taskNotifications.length - 1

    // Reverse to sort oldest-newest
    // Assumption: all tasks are completed, apart from the last one,
    // which is the in-progress task.
    // Exception is when the most recent task comes back as completed
    // this indicates the entire process is done, so we respect that completed status.
    return [...taskNotifications].reverse().map((x, i) => ({
        ...x,
        completed: x.completed || i < lastIndex,
    }))
}
