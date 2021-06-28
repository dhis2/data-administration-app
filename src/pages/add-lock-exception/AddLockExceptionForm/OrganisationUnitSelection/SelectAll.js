import i18n from '@dhis2/d2-i18n'
import { CircularLoader, ButtonStrip, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './SelectAll.module.css'
import useOrgUnitCache from './use-org-unit-cache'

const SelectAll = ({
    d2,
    currentRootId,
    allOrgUnitPaths,
    onSelect,
    onDeselect,
}) => {
    const [loading, setLoading] = useState(false)
    const orgUnitCache = useOrgUnitCache()

    const getOrgUnitPathsForCurrentRoot = async () => {
        if (!currentRootId) {
            return allOrgUnitPaths
        } else if (orgUnitCache.has(currentRootId, null)) {
            return orgUnitCache.get(currentRootId, null)
        } else {
            setLoading(true)

            const orgUnits = (
                await d2.models.organisationUnits.list({
                    root: currentRootId,
                    paging: false,
                    includeDescendants: true,
                    fields: 'id,path',
                })
            ).toArray()

            setLoading(false)
            const orgUnitPaths = orgUnits.map(({ path }) => path)
            orgUnitCache.set(currentRootId, null, orgUnitPaths)
            return orgUnitPaths
        }
    }

    const handleSelectAll = async () => {
        const orgUnitPaths = await getOrgUnitPathsForCurrentRoot()
        onSelect(orgUnitPaths)
    }
    const handleDeselectAll = async () => {
        const orgUnitPaths = await getOrgUnitPathsForCurrentRoot()
        onDeselect(orgUnitPaths)
    }

    if (loading) {
        return (
            <div className={styles.updatingSelection}>
                <CircularLoader small />
                {i18n.t('Updating selection...')}
            </div>
        )
    }

    return (
        <ButtonStrip className={styles.container}>
            <Button onClick={handleSelectAll} disabled={loading}>
                {i18n.t('Select All Org Units')}
            </Button>
            <Button onClick={handleDeselectAll} disabled={loading}>
                {i18n.t('Deselect All Org Units')}
            </Button>
        </ButtonStrip>
    )
}

SelectAll.propTypes = {
    allOrgUnitPaths: PropTypes.array.isRequired,
    d2: PropTypes.object.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    // If currentRootId is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRootId: PropTypes.string,
}

export default SelectAll
