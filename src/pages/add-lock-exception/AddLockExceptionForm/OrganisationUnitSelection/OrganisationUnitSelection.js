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
import SelectAll from './SelectAll'
import SelectByGroup from './SelectByGroup'
import SelectByLevel from './SelectByLevel'

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
        onSelectionUpdate(selected)
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
                    selected={selected}
                    onSelectedChange={onSelectedChange}
                />
                <SelectByGroup
                    groups={groups}
                    currentRootId={currentRoot?.id}
                    selected={selected}
                    onSelectedChange={onSelectedChange}
                />
                <SelectAll
                    d2={d2}
                    currentRoot={currentRoot}
                    selected={selected}
                    onSelectedChange={onSelectedChange}
                />
            </div>
        </div>
    )
}

OrganisationUnitSelection.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    selected: PropTypes.array,
}

export default OrganisationUnitSelection
