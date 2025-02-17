import { useQueryParam, StringParam, withDefault } from 'use-query-params'

const SelectedTabParam = withDefault(StringParam, 'standard')

export const useSelectedTab = () => {
    return useQueryParam('tab', SelectedTabParam, {
        removeDefaultsFromUrl: true,
    })
}
