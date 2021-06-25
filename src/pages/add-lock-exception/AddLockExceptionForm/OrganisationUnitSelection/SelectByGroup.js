import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import Dropdown from './Dropdown/Dropdown'
import { useOrgUnitCache } from './hooks'

const SelectByGroup = ({
    d2,
    groups,
    currentRootId,
    selected,
    onSelectedChange,
}) => {
    const [loading, setLoading] = useState(false)
    // const selection = useSelection()
    const orgUnitCache = useOrgUnitCache()

    const getOrgUnitsForGroup = async groupId => {
        if (orgUnitCache.has(currentRootId, groupId)) {
            return this.groupCache.get(groupId)
        } else {
            setLoading(true)

            // TODO: Better error handling and set loading to false if encountered error
            const orgUnits = currentRootId
                ? (
                      await d2.models.organisationUnits.list({
                          root: currentRootId,
                          paging: false,
                          includeDescendants: true,
                          fields: 'id,path',
                          filter: `organisationUnitGroups.id:eq:${groupId}`,
                      })
                  ).toArray()
                : (
                      await d2.models.organisationUnitGroups.get(groupId, {
                          fields: 'organisationUnits[id,path]',
                      })
                  ).organisationUnits.toArray()

            setLoading(false)
            orgUnitCache.set(currentRootId, groupId, orgUnits)
            return orgUnits
        }
    }
    const handleSelect = async () => {
        const orgUnits = await getOrgUnitsForGroup(selectedGroupId)
        onUpdateSelection(selection.add(orgUnits))
    }
    const handleDeselect = () => {
        getOrgUnitsForGroup(selectedGroupId).then(selection.remove)
    }

    return (
        <Dropdown
            menuItems={groups}
            value={selectedGroupId}
            label={i18n.t('Organisation unit group')}
            placeholder={i18n.t('Select an organisation unit group')}
            loading={loading}
            onChange={handleChangeSelection}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
        />
    )
}

OrgUnitSelectByGroup.propTypes = {
    // groups is an array of either ModelCollection objects or plain objects,
    // where each object should contain `id` and `displayName` properties
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,

    // selected is an array of selected organisation unit IDs
    selected: PropTypes.array.isRequired,

    // Whenever the selection changes, onSelectedChange will be called with
    // one argument: The new array of selected organisation unit paths
    onSelectedChange: PropTypes.func.isRequired,

    // If currentRootId is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRootId: PropTypes.string,
}

export default OrgUnitSelectByGroup
