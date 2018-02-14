export const INIT_ENDPOINT = 'dataIntegrity';
export const PULL_ENDPOINT = 'system/tasks/DATA_INTEGRITY';
export const PULL_INTERVAL = 5000;
export const DATA_ENDPOINT = 'system/taskSummaries/data_integrity';

export const dataIntegrityControls = [
    {
        key: 'dataElementsWithoutDataSet',
        label: 'Data elements without data set',
    },
    {
        key: 'dataElementsWithoutGroups',
        label: 'Data elements without groups',
    },
    {
        key: 'dataElementsViolatingExclusiveGroupSets',
        label: 'Data elements violating exclusive group sets',
    },
    {
        key: 'dataElementsInDataSetNotInForm',
        label: 'There are data elements in the form, but not in the form or sections',
    },
    {
        key: 'invalidCategoryCombos',
        label: 'Invalid category combinations',
    },
    {
        key: 'dataElementsAssignedToDataSetsWithDifferentPeriodTypes',
        label: 'Data elements assigned to data sets with different period types',
    },
    {
        key: 'dataSetsNotAssignedToOrganisationUnits',
        label: 'Data sets not assigned to organisation units',
    },
    {
        key: 'indicatorsWithIdenticalFormulas',
        label: 'Indicators with identical formulas',
    },
    {
        key: 'indicatorsWithoutGroups',
        label: 'Indicators without groups',
    },
    {
        key: 'invalidIndicatorNumerators',
        label: 'Invalid indicator numerators',
    },
    {
        key: 'invalidIndicatorDenominators',
        label: 'Invalid indicator denominators',
    },
    {
        key: 'indicatorsViolatingExclusiveGroupSets',
        label: 'Indicators violating exclusive group sets',
    },
    {
        key: 'duplicatePeriods',
        label: 'Duplicate periods',
    },
    {
        key: 'organisationUnitsWithCyclicReferences',
        label: 'Organisation units with cyclic references',
    },
    {
        key: 'orphanedOrganisationUnits',
        label: 'Orphaned organisation units',
    },
    {
        key: 'organisationUnitsWithoutGroups',
        label: 'Organisation units without groups',
    },
    {
        key: 'organisationUnitsViolatingExclusiveGroupSets',
        label: 'Organisation units violating exclusive group sets',
    },
    {
        key: 'organisationUnitGroupsWithoutGroupSets',
        label: 'Organisation unit groups without group sets',
    },
    {
        key: 'validationRulesWithoutGroups',
        label: 'Validation rules without groups',
    },
    {
        key: 'invalidValidationRuleLeftSideExpressions',
        label: 'Invalid validation rule left side expressions',
    },
    {
        key: 'invalidValidationRuleRightSideExpressions',
        label: 'Invalid validation rule right side expressions',
    },
    {
        key: 'invalidProgramIndicatorExpressions',
        label: 'Invalid program indicator expressions',
    },
    {
        key: 'invalidProgramIndicatorFilters',
        label: 'Invalid program indicator filters',
    },
];
