import { useState } from 'react'

const useOrgUnitCache = () => {
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
            cache.get(currentRootId).get(itemId),
    }
}

export default useOrgUnitCache
