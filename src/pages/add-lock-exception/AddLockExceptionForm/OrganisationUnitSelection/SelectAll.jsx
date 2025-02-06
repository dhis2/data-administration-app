import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, ButtonStrip, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './SelectAll.module.css'
import useOrgUnitCache from './use-org-unit-cache.js'

const currentRootOrgUnitsQuery = {
    orgUnits: {
        resource: 'organisationUnits',
        id: ({ currentRootId }) => currentRootId,
        params: {
            fields: 'id,path',
            includeDescendants: true,
            paging: false,
        },
    },
}

const SelectAll = ({
    currentRootId,
    allOrgUnitPaths,
    onSelect,
    onDeselect,
}) => {
    const [loading, setLoading] = useState(false)
    const engine = useDataEngine()
    const orgUnitCache = useOrgUnitCache()
    const errorAlert = useAlert(({ error }) => error.message, {
        critical: true,
    })

    const getOrgUnitPathsForCurrentRoot = async () => {
        if (!currentRootId) {
            return allOrgUnitPaths
        } else if (orgUnitCache.has(currentRootId, null)) {
            return orgUnitCache.get(currentRootId, null)
        }

        setLoading(true)
        try {
            const result = await engine.query(currentRootOrgUnitsQuery, {
                variables: {
                    currentRootId,
                },
            })
            const orgUnits = result.orgUnits.organisationUnits
            const orgUnitPaths = orgUnits.map(({ path }) => path)
            orgUnitCache.set(currentRootId, null, orgUnitPaths)
            return orgUnitPaths
        } catch (error) {
            errorAlert.show({ error })
            throw error
        } finally {
            setLoading(false)
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
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    // If currentRootId is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRootId: PropTypes.string,
}

export default SelectAll
