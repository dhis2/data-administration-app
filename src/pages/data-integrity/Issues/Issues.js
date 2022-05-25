import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import IssueCard from './IssueCard.js'
import styles from './Issues.module.css'

const controls = {
    dataElementsWithoutDataSet: i18n.t('Data elements without data set'),
    dataElementsWithoutGroups: i18n.t('Data elements without groups'),
    dataElementsViolatingExclusiveGroupSets: i18n.t(
        'Data elements violating exclusive group sets'
    ),
    dataElementsAssignedToDataSetsWithDifferentPeriodTypes: i18n.t(
        'Data elements assigned to data sets with different period types'
    ),
    dataSetsNotAssignedToOrganisationUnits: i18n.t(
        'Data sets not assigned to organisation units'
    ),
    indicatorsWithIdenticalFormulas: i18n.t(
        'Indicators with identical formulas'
    ),
    indicatorsWithoutGroups: i18n.t('Indicators without groups'),
    invalidIndicatorNumerators: i18n.t('Invalid indicator numerators'),
    invalidIndicatorDenominators: i18n.t('Invalid indicator denominators'),
    indicatorsViolatingExclusiveGroupSets: i18n.t(
        'Indicators violating exclusive group sets'
    ),
    organisationUnitsWithCyclicReferences: i18n.t(
        'Organisation units with cyclic references'
    ),
    orphanedOrganisationUnits: i18n.t('Orphaned organisation units'),
    organisationUnitsWithoutGroups: i18n.t('Organisation units without groups'),
    organisationUnitsViolatingExclusiveGroupSets: i18n.t(
        'Organisation units violating exclusive group sets'
    ),
    organisationUnitGroupsWithoutGroupSets: i18n.t(
        'Organisation unit groups without group sets'
    ),
    validationRulesWithoutGroups: i18n.t('Validation rules without groups'),
    invalidValidationRuleLeftSideExpressions: i18n.t(
        'Invalid validation rule left side expressions'
    ),
    invalidValidationRuleRightSideExpressions: i18n.t(
        'Invalid validation rule right side expressions'
    ),
    invalidProgramIndicatorExpressions: i18n.t(
        'Invalid program indicator expressions'
    ),
    invalidProgramIndicatorFilters: i18n.t('Invalid program indicator filters'),
    dataElementsInDataSetNotInForm: i18n.t(
        'There are data elements in the form, but not in the form or sections'
    ),
    invalidCategoryCombos: i18n.t('Invalid category combinations'),
    duplicatePeriods: i18n.t('Duplicate periods'),
    programRulesWithNoCondition: i18n.t('Program rules with no condition'),
    programRulesWithNoAction: i18n.t('Program rules with no action'),
    programRulesWithNoPriority: i18n.t('Program rules with no priority'),
    programRuleVariablesWithNoDataElement: i18n.t(
        'Program rule variables with no data element'
    ),
    programRuleVariablesWithNoAttribute: i18n.t(
        'Program rule variables with no attribute'
    ),
    programRuleActionsWithNoDataObject: i18n.t(
        'Program rule actions with no data object'
    ),
    programRuleActionsWithNoNotification: i18n.t(
        'Program rule actions with no notification'
    ),
    programRuleActionsWithNoSectionId: i18n.t(
        'Program rule actions with no section id'
    ),
    programRuleActionsWithNoStageId: i18n.t(
        'Program rule actions with no stage id'
    ),
    programIndicatorsWithNoExpression: i18n.t(
        'Program indicators with no expression'
    ),
}

const Issues = ({ issues }) => {
    const errorElementskeys = Object.keys(issues)

    return (
        <div className={styles.issues}>
            {errorElementskeys.map((element) => {
                const label = controls[element]
                if (!label) {
                    return null
                }
                return (
                    <IssueCard
                        key={element}
                        title={label}
                        content={issues[element]}
                    />
                )
            })}
            {Object.keys(controls)
                .filter((element) => !errorElementskeys.includes(element))
                .map((element) => (
                    <IssueCard key={element} title={controls[element]} />
                ))}
        </div>
    )
}

Issues.propTypes = {
    issues: PropTypes.object.isRequired,
}

export default Issues
