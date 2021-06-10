import { useRef, useEffect } from 'react'

export const usePoll = (fn, pollInterval) => {
    const intervalId = useRef(null)

    const cancel = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current)
        }
    }
    const start = (...args) => {
        cancel()
        intervalId.current = setInterval(() => fn(...args), pollInterval)
    }

    useEffect(() => {
        return cancel
    }, [])

    return { start, cancel }
}
