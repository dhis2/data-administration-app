import { useCallback, useMemo } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'

export const useSelectedCheck = (checks) => {
    const [checkQueryParam, setCheckQueryParam] = useQueryParam('check', StringParam)

    const setSelectedCheck = useCallback((check) => {
        setCheckQueryParam(check?.name)
    }, [setCheckQueryParam])

    const selectedCheck = useMemo(() => {
        if (checks && checks.length) {
            return checks.find((check) => check.name === checkQueryParam)
        }
        return null
    }, [checks, checkQueryParam])


    return [selectedCheck, setSelectedCheck]
}
