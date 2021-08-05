import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useRef, useEffect } from 'react'

const useConst = factory => {
    const ref = useRef(null)
    if (ref.current === null) {
        ref.current = factory()
    }
    return ref.current
}

const useLazyInterval = (fn, interval) => {
    const intervalId = useRef(null)
    const [started, setStarted] = useState(false)

    const cancel = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current)
            setStarted(false)
        }
    }
    const start = (...args) => {
        cancel()
        intervalId.current = setInterval(() => fn(...args), interval)
        setStarted(true)
    }

    return { start, cancel, started }
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
    const { start, cancel, started: polling } = useLazyInterval(
        refetch,
        interval
    )

    useEffect(() => {
        return cancel
    }, [])

    useEffect(() => {
        if (error) {
            cancel()
        }
    }, [error])

    return {
        start,
        cancel,
        polling,
        error,
        data: data?.poll,
    }
}
