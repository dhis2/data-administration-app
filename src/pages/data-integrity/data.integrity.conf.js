import { i18nKeys } from '../../i18n'

export const INIT_ENDPOINT = 'dataIntegrity'
export const PULL_INTERVAL = 5000
export const DATA_ENDPOINT = 'system/taskSummaries/DATA_INTEGRITY'
export const PAGE_TITLE = i18nKeys.dataIntegrity.title

export const dataIntegrityControls = [
    {
        key: 'dataElementsWithoutDataSet',
        label: i18nKeys.dataIntegrity.dataElementsWithoutDataSet.label,
        text: i18nKeys.dataIntegrity.dataElementsWithoutDataSet.text,
    },
    {
        key: 'dataElementsWithoutGroups',
        label: i18nKeys.dataIntegrity.dataElementsWithoutGroups.label,
        text: i18nKeys.dataIntegrity.dataElementsWithoutGroups.text,
    },
    {
        key: 'dataElementsViolatingExclusiveGroupSets',
        label:
            i18nKeys.dataIntegrity.dataElementsViolatingExclusiveGroupSets
                .label,
        text:
            i18nKeys.dataIntegrity.dataElementsViolatingExclusiveGroupSets
                .label,
    },
    {
        key: 'dataElementsAssignedToDataSetsWithDifferentPeriodTypes',
        label:
            i18nKeys.dataIntegrity
                .dataElementsAssignedToDataSetsWithDifferentPeriodTypes.label,
        text:
            i18nKeys.dataIntegrity
                .dataElementsAssignedToDataSetsWithDifferentPeriodTypes.text,
    },
    {
        key: 'dataSetsNotAssignedToOrganisationUnits',
        label:
            i18nKeys.dataIntegrity.dataSetsNotAssignedToOrganisationUnits.label,
        text:
            i18nKeys.dataIntegrity.dataSetsNotAssignedToOrganisationUnits.text,
    },
    {
        key: 'indicatorsWithIdenticalFormulas',
        label: i18nKeys.dataIntegrity.indicatorsWithIdenticalFormulas.label,
        text: i18nKeys.dataIntegrity.indicatorsWithIdenticalFormulas.text,
    },
    {
        key: 'indicatorsWithoutGroups',
        label: i18nKeys.dataIntegrity.indicatorsWithoutGroups.label,
        text: i18nKeys.dataIntegrity.indicatorsWithoutGroups.text,
    },
    {
        key: 'invalidIndicatorNumerators',
        label: i18nKeys.dataIntegrity.invalidIndicatorNumerators.label,
        text: i18nKeys.dataIntegrity.invalidIndicatorNumerators.text,
    },
    {
        key: 'invalidIndicatorDenominators',
        label: i18nKeys.dataIntegrity.invalidIndicatorDenominators.label,
        text: i18nKeys.dataIntegrity.invalidIndicatorDenominators.text,
    },
    {
        key: 'indicatorsViolatingExclusiveGroupSets',
        label:
            i18nKeys.dataIntegrity.indicatorsViolatingExclusiveGroupSets.label,
        text: i18nKeys.dataIntegrity.indicatorsViolatingExclusiveGroupSets.text,
    },
    {
        key: 'organisationUnitsWithCyclicReferences',
        label:
            i18nKeys.dataIntegrity.organisationUnitsWithCyclicReferences.label,
        text: i18nKeys.dataIntegrity.organisationUnitsWithCyclicReferences.text,
    },
    {
        key: 'orphanedOrganisationUnits',
        label: i18nKeys.dataIntegrity.orphanedOrganisationUnits.label,
        text: i18nKeys.dataIntegrity.orphanedOrganisationUnits.text,
    },
    {
        key: 'organisationUnitsWithoutGroups',
        label: i18nKeys.dataIntegrity.organisationUnitsWithoutGroups.label,
        text: i18nKeys.dataIntegrity.organisationUnitsWithoutGroups.text,
    },
    {
        key: 'organisationUnitsViolatingExclusiveGroupSets',
        label:
            i18nKeys.dataIntegrity.organisationUnitsViolatingExclusiveGroupSets
                .label,
        text:
            i18nKeys.dataIntegrity.organisationUnitsViolatingExclusiveGroupSets
                .text,
    },
    {
        key: 'organisationUnitGroupsWithoutGroupSets',
        label:
            i18nKeys.dataIntegrity.organisationUnitGroupsWithoutGroupSets.label,
        text:
            i18nKeys.dataIntegrity.organisationUnitGroupsWithoutGroupSets.text,
    },
    {
        key: 'validationRulesWithoutGroups',
        label: i18nKeys.dataIntegrity.validationRulesWithoutGroups.label,
        text: i18nKeys.dataIntegrity.validationRulesWithoutGroups.text,
    },
    {
        key: 'invalidValidationRuleLeftSideExpressions',
        label:
            i18nKeys.dataIntegrity.invalidValidationRuleLeftSideExpressions
                .label,
        text:
            i18nKeys.dataIntegrity.invalidValidationRuleLeftSideExpressions
                .text,
    },
    {
        key: 'invalidValidationRuleRightSideExpressions',
        label:
            i18nKeys.dataIntegrity.invalidValidationRuleRightSideExpressions
                .label,
        text:
            i18nKeys.dataIntegrity.invalidValidationRuleRightSideExpressions
                .text,
    },
    {
        key: 'invalidProgramIndicatorExpressions',
        label: i18nKeys.dataIntegrity.invalidProgramIndicatorExpressions.label,
    },
    {
        key: 'invalidProgramIndicatorFilters',
        label: i18nKeys.dataIntegrity.invalidProgramIndicatorFilters.label,
    },
    {
        key: 'dataElementsInDataSetNotInForm',
        label: i18nKeys.dataIntegrity.dataElementsInDataSetNotInForm.label,
    },
    {
        key: 'invalidCategoryCombos',
        label: i18nKeys.dataIntegrity.invalidCategoryCombos.label,
    },
    {
        key: 'duplicatePeriods',
        label: i18nKeys.dataIntegrity.duplicatePeriods.label,
    },
    {
        key: 'programRulesWithNoCondition',
        label: i18nKeys.dataIntegrity.programRulesWithNoCondition.label,
    },
    {
        key: 'programRulesWithNoAction',
        label: i18nKeys.dataIntegrity.programRulesWithNoAction.label,
    },
    {
        key: 'programRulesWithNoPriority',
        label: i18nKeys.dataIntegrity.programRulesWithNoPriority.label,
    },
    {
        key: 'programRuleVariablesWithNoDataElement',
        label:
            i18nKeys.dataIntegrity.programRuleVariablesWithNoDataElement.label,
    },
    {
        key: 'programRuleVariablesWithNoAttribute',
        label: i18nKeys.dataIntegrity.programRuleVariablesWithNoAttribute.label,
    },
    {
        key: 'programRuleActionsWithNoDataObject',
        label: i18nKeys.dataIntegrity.programRuleActionsWithNoDataObject.label,
    },
    {
        key: 'programRuleActionsWithNoNotification',
        label:
            i18nKeys.dataIntegrity.programRuleActionsWithNoNotification.label,
    },
    {
        key: 'programRuleActionsWithNoSectionId',
        label: i18nKeys.dataIntegrity.programRuleActionsWithNoSectionId.label,
    },
    {
        key: 'programRuleActionsWithNoStageId',
        label: i18nKeys.dataIntegrity.programRuleActionsWithNoStageId.label,
    },
    {
        key: 'programIndicatorsWithNoExpression',
        label: i18nKeys.dataIntegrity.programIndicatorsWithNoExpression.label,
    }
]
