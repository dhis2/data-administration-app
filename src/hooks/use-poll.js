import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useRef, useEffect } from 'react'
import { useLazyInterval } from './use-lazy-interval.js'

const useConst = (factory) => {
    const ref = useRef(null)
    if (ref.current === null) {
        ref.current = factory()
    }
    return ref.current
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
