import { useRef, useEffect } from 'react'

export const usePoll = (fn, pollInterval) => {
    const intervalId = useRef(null)

    const start = (...args) => {
        intervalId.current = setInterval(() => fn(...args), pollInterval)
    }
    const cancel = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current)
        }
    }

    useEffect(() => {
        return cancel
    }, [])

    return { start, cancel }
}
