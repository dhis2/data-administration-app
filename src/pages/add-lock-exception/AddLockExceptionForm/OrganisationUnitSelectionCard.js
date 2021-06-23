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
import OrgUnitSelectAll from '../OrgUnitSelect/OrgUnitSelectAll'
import OrgUnitSelectByGroup from '../OrgUnitSelect/OrgUnitSelectByGroup'
import OrgUnitSelectByLevel from '../OrgUnitSelect/OrgUnitSelectByLevel'
import styles from './OrganisationUnitSelectionCard.module.css'

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

const OrganisationUnitSelectionCard = ({
    dataSetId,
    levels,
    groups,
    selected,
    onSelectionUpdate,
}) => {
    const [currentRoot, setCurrentRoot] = useState(null)
    const { loading, called, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const { d2 } = useD2()

    useEffect(() => {
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
    // TODO: ensure only org units in orgUnitPaths can be selected by OrgSelect components

    return (
        <div className={styles.organisationUnitSelectionCard}>
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
                <div>
                    <div>
                        {currentRoot
                            ? i18n.t(
                                  'For organisation units within {{organisationUnitName}}:',
                                  {
                                      organisationUnitName:
                                          currentRoot.displayName,
                                  }
                              )
                            : i18n.t('For all organisation units:')}
                    </div>
                    <OrgUnitSelectByLevel
                        d2={d2}
                        levels={levels}
                        selected={selected}
                        currentRoot={currentRoot}
                        onUpdateSelection={onSelectionUpdate}
                    />
                    <OrgUnitSelectByGroup
                        d2={d2}
                        groups={groups}
                        selected={selected}
                        currentRoot={currentRoot}
                        onUpdateSelection={onSelectionUpdate}
                    />
                    <OrgUnitSelectAll
                        d2={d2}
                        selected={selected}
                        currentRoot={currentRoot}
                        onUpdateSelection={onSelectionUpdate}
                    />
                </div>
            </div>
        </div>
    )
}

OrganisationUnitSelectionCard.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onSelectionUpdate: PropTypes.func.isRequired,
    selected: PropTypes.array,
}

export default OrganisationUnitSelectionCard
