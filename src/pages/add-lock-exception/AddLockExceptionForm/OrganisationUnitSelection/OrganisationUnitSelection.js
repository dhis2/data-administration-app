import { useDataQuery } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import {
    NoticeBox,
    CenteredContent,
    CircularLoader,
    OrganisationUnitTree,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import styles from './OrganisationUnitSelection.module.css'
// import SelectAll from './SelectAll'
import SelectByGroup from './SelectByGroup'
import SelectByLevel from './SelectByLevel'

const union = (arr1, arr2) => [...new Set(arr1.concat(arr2))]
const difference = (arr1, arr2) => {
    const set = new Set(arr1)
    arr2.forEach(item => {
        set.delete(item)
    })
    return [...set]
}

const query = {
    rootWithMembers: {
        resource: 'organisationUnits',
        params: ({ dataSetId }) => ({
            fields: 'id,path',
            level: 1,
            memberCollection: 'dataSets',
            memberObject: dataSetId,
            paging: false,
        }),
    },
    dataSetMembers: {
        resource: 'dataSets',
        id: ({ dataSetId }) => dataSetId,
        params: {
            fields: 'organisationUnits[id,path]',
            paging: false,
        },
    },
}

const OrganisationUnitSelection = ({
    dataSetId,
    levels,
    groups,
    selected,
    onSelectedChange,
}) => {
    const [currentRoot, setCurrentRoot] = useState(null)
    const { loading, called, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const { d2 } = useD2()

    useEffect(() => {
        setCurrentRoot(null)
        refetch({ dataSetId })
    }, [dataSetId])

    const handleOrgUnitClick = ({ selected, ...currentRoot }) => {
        setCurrentRoot(currentRoot)
        onSelectedChange(selected)
    }
    const handleSelect = orgUnitPaths => {
        const newSelected = union(selected, orgUnitPaths)
        onSelectedChange(newSelected)
    }
    const handleDeselect = orgUnitPaths => {
        const newSelected = difference(selected, orgUnitPaths)
        onSelectedChange(newSelected)
    }

    if (loading || !called) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <NoticeBox title={i18n.t('Error loading data for data set')} error>
                {error.message}
            </NoticeBox>
        )
    }

    const rootWithMembers = data.rootWithMembers.organisationUnits[0]
    const orgUnitPaths = data.dataSetMembers.organisationUnits.map(
        ou => ou.path
    )

    return (
        <div className={styles.container}>
            <div
                className={styles.organisationUnitTree}
                data-test="add-lock-exception-org-unit-tree"
            >
                <OrganisationUnitTree
                    roots={[rootWithMembers.id]}
                    initiallyExpanded={[rootWithMembers.path]}
                    highlighted={currentRoot ? [currentRoot.id] : []}
                    filter={orgUnitPaths}
                    selected={selected}
                    onChange={handleOrgUnitClick}
                />
            </div>
            <div className={styles.right}>
                <div className={styles.currentRoot}>
                    {currentRoot
                        ? i18n.t(
                              'For organisation units within {{organisationUnitName}}:',
                              {
                                  organisationUnitName: currentRoot.displayName,
                              }
                          )
                        : i18n.t('For all organisation units:')}
                </div>
                <SelectByLevel
                    d2={d2}
                    levels={levels}
                    currentRoot={currentRoot}
                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
                />
                <SelectByGroup
                    d2={d2}
                    groups={groups}
                    currentRootId={currentRoot?.id}
                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
                />
                {/* TODO */}
                {/*<SelectAll
                    d2={d2}
                    currentRoot={currentRoot}
                    selected={selected}

                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
                />*/}
            </div>
        </div>
    )
}

OrganisationUnitSelection.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    levels: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
}

export default OrganisationUnitSelection
