import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import OrgUnitSelectAll from '../OrgUnitSelect/OrgUnitSelectAll'
import OrgUnitSelectByGroup from '../OrgUnitSelect/OrgUnitSelectByGroup'
import OrgUnitSelectByLevel from '../OrgUnitSelect/OrgUnitSelectByLevel'
import OrgUnitTree from '../OrgUnitTree'
import styles from './OrganisationUnitSelectionCard.module.css'

const OrganisationUnitSelectionCard = ({
    d2,
    levels,
    groups,
    rootWithMembers,
    selected,
    currentRoot,
    dataSetId,
    onOrgUnitClick,
    onChangeRoot,
    orgUnitPaths,
    onSelectionUpdate,
}) => (
    <div className={styles.organisationUnitSelectionCard}>
        <div
            className={styles.organisationUnitTree}
            data-test="add-lock-exception-org-unit-tree"
        >
            {rootWithMembers ? (
                <OrgUnitTree
                    root={rootWithMembers}
                    selected={selected}
                    currentRoot={currentRoot}
                    initiallyExpanded={[`/${rootWithMembers.id}`]}
                    memberCollection="dataSets"
                    memberObject={dataSetId}
                    onSelectClick={onOrgUnitClick}
                    onChangeCurrentRoot={onChangeRoot}
                    orgUnitsPathsToInclude={orgUnitPaths}
                />
            ) : (
                i18n.t('Loading organisation units tree...')
            )}
        </div>
        <div className={styles.right}>
            <div>
                <div>
                    {currentRoot
                        ? i18n.t(
                              'For organisation units within {{organisationUnitName}}:',
                              {
                                  organisationUnitName: currentRoot.displayName,
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

OrganisationUnitSelectionCard.propTypes = {
    d2: PropTypes.object.isRequired,
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onChangeRoot: PropTypes.func.isRequired,
    onOrgUnitClick: PropTypes.func.isRequired,
    onSelectionUpdate: PropTypes.func.isRequired,
    currentRoot: PropTypes.object,
    dataSetId: PropTypes.string,
    orgUnitPaths: PropTypes.array,
    rootWithMembers: PropTypes.array,
    selected: PropTypes.object,
}

export default OrganisationUnitSelectionCard
