import { useDataQuery } from '@dhis2/app-runtime'
import { useUserOrganisationUnits } from '../../hooks/use-user-organisation-units'

const dataSetsQuery = {
    dataSets: {
        resource: 'dataSets',
        params: {
            fields: ['id', 'displayName'],
            paging: false,
        },
    },
}

export const useQueries = () => {
    const {
        loading: loadingOrgUnits,
        error: errorOrgUnits,
        organisationUnits,
    } = useUserOrganisationUnits()
    const {
        loading: loadingDataSets,
        error: errorDataSets,
        data,
    } = useDataQuery(dataSetsQuery)

    return {
        loading: loadingOrgUnits || loadingDataSets,
        error: errorOrgUnits || errorDataSets,
        organisationUnits,
        dataSets: data?.dataSets.dataSets,
    }
}
