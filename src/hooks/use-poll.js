import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useRef, useEffect, useCallback } from 'react'

const useConst = (factory) => {
    const ref = useRef(null)
    if (ref.current === null) {
        ref.current = factory()
    }
    return ref.current
}

export const useLazyInterval = (fn, interval) => {
    const fnRef = useRef()
    fnRef.current = fn
    const intervalId = useRef(null)
    const [started, setStarted] = useState(false)

    const cancel = useCallback(() => {
            clearTimeout(intervalId.current)
            setStarted(false)
    }, [])

    const start = (...args) => {
        cancel()

        const startTimeout = () => setTimeout(() => fnRef.current(...args).finally(() => {
            if(started) {
                intervalId.current = startTimeout()
            }
        }), interval)

        startTimeout()
        setStarted(true)
    }

    useEffect(() => {
        return cancel
    }, [cancel])

    return { start, cancel, started }
}

export const usePoll = ({ query, interval, checkDone }) => {
    // Store data in state and update in onComplete as useDataQuery sets data to
    // null when a refetch is triggered
    const [data, setData] = useState(null)
    const wrappedQuery = useConst(() => ({
        poll: query,
    }))
    const { refetch, error } = useDataQuery(wrappedQuery, {
        lazy: true,
        onComplete: (data) => {
            setData(data)
            if (checkDone(data.poll)) {
                cancel()
            }
        },
    })
    const {
        start,
        cancel,
        started: polling,
    } = useLazyInterval(refetch, interval)

    useEffect(() => {
        if (error) {
            cancel()
        }
    }, [error, cancel])

    return {
        start,
        cancel,
        polling,
        error,
        data: data?.poll,
    }
}
