import { renderHook, act } from '@testing-library/react'
import useOrgUnitCache from './use-org-unit-cache.js'

const currentRootId = 'root-1'
const itemId = 'item-1'
const orgUnitPaths = ['path-1', 'path-2', 'path-3']

test('can store and retrieve organisation units in cache for specific root ID and item ID', () => {
    const { result } = renderHook(() => useOrgUnitCache())

    expect(result.current.has(currentRootId, itemId)).toBe(false)

    act(() => {
        result.current.set(currentRootId, itemId, orgUnitPaths)
    })

    expect(result.current.has(currentRootId, itemId)).toBe(true)
    expect(result.current.get(currentRootId, itemId)).toBe(orgUnitPaths)
})

test('can store organisation units for multiple items belonging to same root ID', () => {
    const itemId2 = 'item-2'
    const orgUnitPaths2 = ['path-4']

    const { result } = renderHook(() => useOrgUnitCache())

    act(() => {
        result.current.set(currentRootId, itemId, orgUnitPaths)
        result.current.set(currentRootId, itemId2, orgUnitPaths2)
    })

    expect(result.current.get(currentRootId, itemId)).toBe(orgUnitPaths)
    expect(result.current.get(currentRootId, itemId2)).toBe(orgUnitPaths2)
})

test('undefined values of currentRootId are cast to null', () => {
    const { result } = renderHook(() => useOrgUnitCache())

    expect(result.current.has(null, itemId)).toBe(false)

    act(() => {
        result.current.set(undefined, itemId, orgUnitPaths)
    })

    expect(result.current.has(null, itemId)).toBe(true)
    expect(result.current.get(null, itemId)).toBe(orgUnitPaths)
})
