import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'

const currentUserQuery = {
    currentUser: {
        resource: 'me',
        params: {
            fields: ['organisationUnits', 'authorities'],
        },
    },
}

const allRootsQuery = {
    allRoots: {
        resource: 'organisationUnits',
        params: {
            filter: 'level:eq:1',
            fields: 'id',
            paging: 'false',
        },
    },
}

export const useUserOrganisationUnits = () => {
    const { loading, data, error } = useDataQuery(currentUserQuery)
    const {
        called: calledAll,
        loading: loadingAll,
        data: dataAll,
        error: errorAll,
        refetch,
    } = useDataQuery(allRootsQuery, { lazy: true })

    useEffect(() => {
        if (
            !(data?.currentUser.organisationUnits.length > 0) &&
            data?.currentUser?.authorities.includes('ALL')
        ) {
            //fetch all orgs
            refetch()
        }
    }, [data])

    if (calledAll) {
        return {
            loading: loadingAll,
            error: errorAll,
            organisationUnits: dataAll?.allRoots.organisationUnits,
        }
    }

    return {
        loading,
        error,
        organisationUnits: data?.currentUser.organisationUnits,
    }
}
