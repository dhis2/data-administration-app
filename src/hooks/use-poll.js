import { useDataQuery } from '@dhis2/app-runtime'
import { useRef, useEffect } from 'react'

const useConst = factory => {
    const ref = useRef(null)
    if (ref.current === null) {
        ref.current = factory()
    }
    return ref.current
}

const useLazyInterval = (fn, interval) => {
    const intervalId = useRef(null)

    const cancel = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current)
        }
    }
    const start = (...args) => {
        cancel()
        intervalId.current = setInterval(() => fn(...args), interval)
    }

    useEffect(() => {
        return cancel
    }, [])

    return { start, cancel }
}

export const usePoll = ({ query, interval, checkDone }) => {
    const wrappedQuery = useConst(() => ({
        poll: query,
    }))
    const { refetch, error, data } = useDataQuery(wrappedQuery, {
        lazy: true,
        onComplete: data => {
            if (checkDone(data.poll)) {
                cancel()
            }
        },
    })
    const { start, cancel } = useLazyInterval(refetch, interval)

    useEffect(() => {
        if (error) {
            cancel()
        }
    }, [error])

    return {
        start,
        cancel,
        error,
        data: data?.poll,
    }
}
