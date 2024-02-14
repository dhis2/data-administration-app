import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useRef, useEffect, useCallback } from 'react'

const useConst = (factory) => {
    const ref = useRef(null)
    if (ref.current === null) {
        ref.current = factory()
    }
    return ref.current
}

/** Utility hook mainly used for polling. Calls fn every interval milliseconds, or after
 * the previous promise returned by fn is resolved (if longer than interval).
 * Lasts until cancel is called.
 *
 * This does not start the interval on mount. start() must be called to start the interval.
 * Any argument passed to start() is forwarved to fn.
 *
 * Cancel must be called to stop the interval.
 *
 * @param {function} fn - a function that returns a promise
 * @param {number} interval - the interval in milliseconds
 */
export const useLazyInterval = (fn, interval) => {
    const fnRef = useRef()
    fnRef.current = fn
    const intervalId = useRef(null)
    // need ref to keep track inside timeout
    // need state as well, because we shouldn't read refs during render - and it's returned from the hook
    const startedRef = useRef(false)
    const [started, setStarted] = useState(false)

    const cancel = useCallback(() => {
        if (intervalId.current) {
            clearTimeout(intervalId.current)
            startedRef.current = false
            setStarted(false)
        }
    }, [])

    const start = useCallback(
        (...args) => {
            cancel()

            const startTimeout = () =>
                setTimeout(() => {
                    fnRef.current(...args).finally(() => {
                        if (startedRef.current) {
                            intervalId.current = startTimeout()
                        }
                    })
                }, interval)

            startTimeout()
            startedRef.current = true
            setStarted(true)
        },
        [cancel, interval]
    )

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
