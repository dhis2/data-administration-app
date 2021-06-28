import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Controls from './Controls'
import useOrgUnitCache from './use-org-unit-cache'

const SelectByLevel = ({ d2, levels, currentRoot, onSelect, onDeselect }) => {
    const [loading, setLoading] = useState(false)
    const [level, setLevel] = useState(null)
    const orgUnitCache = useOrgUnitCache()

    const currentRootId = currentRoot?.id
    const currentRootLevel = currentRoot
        ? // The OrganisationUnitTree component does not currently fetch the `level`
          // field and so we must count the number of forward slashes in the org unit
          // path
          currentRoot.level || currentRoot.path.match(/\//g).length
        : 1
    const items = levels
        .filter(({ level }) => level >= currentRootLevel)
        .map(({ displayName, level }) => ({
            label: displayName,
            value: level.toString(),
        }))
    const getOrgUnitPathsForLevel = async () => {
        if (orgUnitCache.has(currentRootId, level)) {
            return orgUnitCache.get(currentRootId, level)
        } else {
            setLoading(true)

            // TODO: Better error handling (show alert) and set loading to false
            // if encountered error
            const fields = 'id,path'
            const relativeLevel = level - currentRootLevel
            const orgUnits = (currentRootId
                ? await d2.models.organisationUnits.list({
                      paging: false,
                      level: relativeLevel,
                      fields,
                      root: currentRootId,
                  })
                : await d2.models.organisationUnits.list({
                      paging: false,
                      level,
                      fields,
                  })
            ).toArray()

            setLoading(false)
            const orgUnitPaths = orgUnits.map(({ path }) => path)
            orgUnitCache.set(currentRootId, level, orgUnitPaths)
            return orgUnitPaths
        }
    }

    const handleSelect = async () => {
        const orgUnitPaths = await getOrgUnitPathsForLevel()
        onSelect(orgUnitPaths)
    }
    const handleDeselect = async () => {
        const orgUnitPaths = await getOrgUnitPathsForLevel()
        onDeselect(orgUnitPaths)
    }

    return (
        <Controls
            items={items}
            selectedItem={level ? String(level) : null}
            onSelectedItemChange={level => setLevel(Number(level))}
            label={i18n.t('Organisation unit level')}
            placeholder={i18n.t('Select an organisation unit level')}
            loading={loading}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
        />
    )
}

SelectByLevel.propTypes = {
    d2: PropTypes.object.isRequired,
    // levels is an array of objects, where each object should contain `level`
    // and `displayName` properties
    levels: PropTypes.array.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: (props, propName) => {
        if (props[propName]) {
            if (!Object.prototype.hasOwnProperty.call(props[propName], 'id')) {
                return new Error('currentRoot must have an `id` property')
            }

            if (
                !Object.prototype.hasOwnProperty.call(
                    props[propName],
                    'level'
                ) &&
                !Object.prototype.hasOwnProperty.call(props[propName], 'path')
            ) {
                return new Error(
                    'currentRoot must have either a `level` or a `path` property'
                )
            }
        }
    },
}

export default SelectByLevel
