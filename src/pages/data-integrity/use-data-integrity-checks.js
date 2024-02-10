import { useDataQuery } from '@dhis2/app-runtime'

const dataIntegrityChecksQuery = {
    result: {
        resource: 'dataIntegrity',
    },
}

export const useDataIntegrityChecks = () => {
    // grabs the the entire list of checks
    const queryResult = useDataQuery(dataIntegrityChecksQuery)
    return {
        ...queryResult,
        data: queryResult.data?.result,
    }
}
