import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Controls from './Controls'
import useOrgUnitCache from './use-org-unit-cache'

const currentRootOrgUnitsQuery = {
    orgUnits: {
        resource: 'organisationUnits',
        id: ({ currentRootId }) => currentRootId,
        params: ({ groupId }) => ({
            fields: 'id,path',
            filter: `organisationUnitGroups.id:eq:${groupId}`,
            includeDescendants: true,
            paging: false,
        }),
    },
}
const orgUnitGroupsQuery = {
    orgUnitGroups: {
        resource: 'organisationUnitGroups',
        id: ({ groupId }) => groupId,
        params: {
            fields: `organisationUnits[id,path]`,
        },
    },
}

const SelectByGroup = ({ groups, currentRootId, onSelect, onDeselect }) => {
    const [loading, setLoading] = useState(false)
    const [groupId, setGroupId] = useState(null)
    const engine = useDataEngine()
    const orgUnitCache = useOrgUnitCache()

    const items = groups.map(({ id, displayName }) => ({
        label: displayName,
        value: id,
    }))
    const getOrgUnitPathsForGroup = async () => {
        if (orgUnitCache.has(currentRootId, groupId)) {
            return orgUnitCache.get(currentRootId, groupId)
        } else {
            setLoading(true)

            // TODO: Better error handling (show alert) and set loading to false
            // if encountered error
            const orgUnits = currentRootId
                ? (
                      await engine.query(currentRootOrgUnitsQuery, {
                          variables: {
                              currentRootId,
                              groupId,
                          },
                      })
                  ).orgUnits.organisationUnits
                : (
                      await engine.query(orgUnitGroupsQuery, {
                          variables: {
                              groupId,
                          },
                      })
                  ).orgUnitGroups.organisationUnits

            setLoading(false)
            const orgUnitPaths = orgUnits.map(({ path }) => path)
            orgUnitCache.set(currentRootId, groupId, orgUnitPaths)
            return orgUnitPaths
        }
    }

    const handleSelect = async () => {
        const orgUnitPaths = await getOrgUnitPathsForGroup()
        onSelect(orgUnitPaths)
    }
    const handleDeselect = async () => {
        const orgUnitPaths = await getOrgUnitPathsForGroup()
        onDeselect(orgUnitPaths)
    }

    return (
        <Controls
            items={items}
            selectedItem={groupId}
            onSelectedItemChange={setGroupId}
            label={i18n.t('Organisation unit group')}
            placeholder={i18n.t('Select an organisation unit group')}
            loading={loading}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
        />
    )
}

SelectByGroup.propTypes = {
    // groups is an array of objects, where each object should contain `id` and
    // `displayName` properties
    groups: PropTypes.array.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    // If currentRootId is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRootId: PropTypes.string,
}

export default SelectByGroup
