import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useCheckDetailsStore = create(
    devtools((set, get) => ({
        checks: {},

        addCheck: (check) =>
            set((state) => ({
                checks: { ...state.checks, [check.name]: addRunInfo(check) },
            })),
        getCheck: (name) => get().checks[name],
        getMergedCheck: (summaryCheck) => {
            const detailsCheck = get().getCheck(summaryCheck.name)

            if (!detailsCheck) {
                return summaryCheck
            }
            if (!summaryCheck && detailsCheck) {
                return detailsCheck
            }

            const mostRecent =
                summaryCheck.runInfo.finishedTime >
                detailsCheck.runInfo.finishedTime
                    ? summaryCheck
                    : detailsCheck

            return mostRecent
        },
    }))
)


export const addRunInfo = (detailsCheck) => {
    const { finishedTime, startTime, ...rest } = detailsCheck
    // runInfo contains most of the same props as check, pick only the relevant ones
    const runInfo = {
        count: detailsCheck.issues.length,
        finishedTime,
        startTime,
    }
    return { ...rest, runInfo }
}

export const useAddCheckDetails = () =>
    useCheckDetailsStore((state) => state.addCheck)

export const useMergedCheck = (check) => {
    const mergedCheck = useCheckDetailsStore((state) => state.getMergedCheck(check))

    return mergedCheck
}
