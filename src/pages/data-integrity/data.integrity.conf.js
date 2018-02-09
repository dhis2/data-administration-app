export const INIT_ENDPOINT = 'dataIntegrity';
export const PULL_ENDPOINT = 'system/tasks/DATA_INTEGRITY';
export const PULL_INTERVAL = 5000;
export const DATA_ENDPOINT = 'system/taskSummaries/data_integrity';

export const dataIntegrityControls = [
    {
        key: 'dataElementsWithoutDataSet',
        label: 'Data elements without set',
    },
    {
        key: 'dataElementsWithoutGroups',
        label: 'Data elements without groups',
    },
    {
        key: 'dataElementsViolatingExclusiveGroupSets',
        label: 'Data elements violated exclusive group sets',
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
        label: 'Data Elements Assigned to Tokens with Different Period Types',
    },
    {
        key: 'dataSetsNotAssignedToOrganisationUnits',
        label: 'Tabs not assigned to organizational units',
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
        label: 'Indicators violated exclusive group sets',
    },
    {
        key: 'duplicatePeriods',
        label: 'Duplicate periods',
    },
    {
        key: 'organisationUnitsWithCyclicReferences',
        label: 'Organizational units with cyclic references',
    },
    {
        key: 'orphanedOrganisationUnits',
        label: 'Organizational Units Orphans',
    },
    {
        key: 'organisationUnitsWithoutGroups',
        label: 'Organizational units without groups',
    },
    {
        key: 'organisationUnitsViolatingExclusiveGroupSets',
        label: 'Organizational units that violate exclusive group sets',
    },
    {
        key: 'organisationUnitGroupsWithoutGroupSets',
        label: 'Groups of units Organization without sets group',
    },
    {
        key: 'validationRulesWithoutGroups',
        label: 'Validation rules without groups',
    },
    {
        key: 'invalidValidationRuleLeftSideExpressions',
        label: 'Invalid expression validation rule on the left',
    },
    {
        key: 'invalidValidationRuleRightSideExpressions',
        label: 'Invalid expression validation rule on the right',
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
