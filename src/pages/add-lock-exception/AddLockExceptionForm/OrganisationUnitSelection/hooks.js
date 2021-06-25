// TODO: Unit tests

import { useState } from 'react'

export const useOrgUnitCache = () => {
    const [cache, setCache] = useState(new Map())

    return {
        has: (currentRootId = null, itemId) =>
            cache.has(currentRootId) && cache.get(currentRootId).has(itemId),
        set: (currentRootId = null, itemId, orgUnits) => {
            if (!cache.has(currentRootId)) {
                cache.set(currentRootId, new Map())
            }
            const currentRootCache = cache.get(currentRootId)
            currentRootCache.set(itemId, orgUnits)
            setCache(cache)
        },
        get: (currentRootId = null, itemId) =>
            cache.get(currenRootId).get(itemId),
    }
}

const mergeUnique = (arr1, arr2) => {
    return [...new Set(arr1.concat(arr2))]
}

// TODO: Move to org unit selection so `selected` prop is single source of truth
export const useSelection = () => {
    // const [selection, setSelection] = useState(null)

    return {
        get: () => selection,
        add: () => {
            const newSelection = mergeUnique(
                this.props.selected,
                orgUnits.map(ou => ou.path)
            )
            return newSelection
        },
        remove,
    }
}
