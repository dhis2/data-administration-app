export const INIT_ENDPOINT = 'dataIntegrity';
export const PULL_INTERVAL = 5000;
export const DATA_ENDPOINT = 'system/taskSummaries/DATA_INTEGRITY';

export const PAGE_TITLE = 'Data Integrity';

export const dataIntegrityControls = [
    {
        key: 'dataElementsWithoutDataSet',
        label: 'Data elements without data set',
        text: 'Each data element must be assigned to a data set. Values for data elements will not be able to be ' +
        'entered into the system if a data element is not assigned to a data set. Choose Maintenance->Datasets->Edit ' +
        'from the main menu and then add the "orphaned" data element to the appropriate data set.',
    },
    {
        key: 'dataElementsWithoutGroups',
        label: 'Data elements without groups',
        text: 'Some Data Elements have been allocated to several Data Element Groups. This is currently not allowed, ' +
        'because it will result in duplication of linked data records in the PivotSource recordsets that `feed` the ' +
        'pivot tables. Go to Maintenance -> Data Element Groups to review each Data Element identified and ' +
        'remove the incorrect Group allocations',
    },
    {
        key: 'dataElementsViolatingExclusiveGroupSets',
        label: 'Data elements violating exclusive group sets',
        text: 'Some data elements have been allocated to several data element groups that are members of the same' +
        ' data element group set. All group sets in DHIS are defined as exclusive, which means that a data element' +
        ' can only be allocated to one data element group within that group set. Go to Maintenance -> Data elements' +
        ' and indicators ->Data element groups to review each data element identified in the integrity check. Either' +
        ' remove the data element from all groups except the one that it should be allocated to, or see if one of the' +
        ' groups should be placed in a different group set.',
    },
    {
        key: 'dataElementsAssignedToDataSetsWithDifferentPeriodTypes',
        label: 'Data elements assigned to data sets with different period types',
        text: 'Data Elements should not be assigned to two separate data sets whose period types differ.' +
        ' The recommended approach would be to create two separate data elements (for instance a monthly and yearly' +
        ' data element) and assign these to respective datasets.',
    },
    {
        key: 'dataSetsNotAssignedToOrganisationUnits',
        label: 'Data sets not assigned to organisation units',
        text: 'All data sets should be assigned to at least one organisation unit.',
    },
    {
        key: 'indicatorsWithIdenticalFormulas',
        label: 'Indicators with identical formulas',
        text: 'Although this rule will not affect data quality, it generally does not make sense to have two' +
        ' indicators with the exact same definition. Review the identified indicators and their formulas and' +
        ' delete or modify any indicator that appears to be the duplicate.',
    },
    {
        key: 'indicatorsWithoutGroups',
        label: 'Indicators without groups',
        text: 'All Data Elements and Indicators must be assigned to at least one group, so these Indicators need to' +
        ' be allocated to their correct Data Element and Indicator Group. Go to Maintenance -> Indicator Groups,' +
        ' and allocate each of the `Orphaned` Indicators to its correct group.',
    },
    {
        key: 'invalidIndicatorNumerators',
        label: 'Invalid indicator numerators',
        text: 'Violations of this rule may be caused by an incorrect reference to a deleted or modified data' +
        ' element. Review the indicator and make corrections to the numerator definition.',
    },
    {
        key: 'invalidIndicatorDenominators',
        label: 'Invalid indicator denominators',
        text: 'Violations of this rule may be caused by an incorrect reference to a deleted or modified data' +
        ' element. Review the indicator and make corrections to the denominator definition.',
    },
    {
        key: 'indicatorsViolatingExclusiveGroupSets',
        label: 'Indicators violating exclusive group sets',
        text: 'Some indicators have been allocated to several indicator groups that are members of the same' +
        ' indicator group set. All group sets in DHIS are defined as exclusive, which means that an indicator can' +
        ' only be allocated to one indicator group within that group set. Go to Maintenance -> Data elements and' +
        ' indicators ->Indicator groups to review each indicator identified in the integrity check. Either remove' +
        ' the indicator from all groups except the one that it should be allocated to, or see if one of the groups' +
        ' should be placed in a different group set.',
    },
    {
        key: 'organisationUnitsWithCyclicReferences',
        label: 'Organisation units with cyclic references',
        text: 'Organisation units cannot be both parent and children of each other, directly nor indirectly.',
    },
    {
        key: 'orphanedOrganisationUnits',
        label: 'Orphaned organisation units',
        text: 'All organisation units must exist within the organisation unit hierarchy. Go to' +
        ' Organisation->Hierarchy Operations and move the offending organisation unit into the proper position in' +
        ' the hierarchy.',
    },
    {
        key: 'organisationUnitsWithoutGroups',
        label: 'Organisation units without groups',
        text: 'All organisation units must be allocated to at least one group. The problem might either be that you' +
        ' have not defined any `compulsory` OrgUnit Group Set at all, or that there are violations of the' +
        ' `compulsory` rule for some OrgUnits . NOTE: If you have defined no `compulsory` OrgUnit Group Sets, then' +
        ' you must first define them by going to Maintenance -> Organisation units->Organisation unit group sets and' +
        ' define at least one `compulsory` Group Set (the group set `OrgUnitType` are nearly universally relevant).' +
        ' If you have the relevant group sets, go to Maintenance -> OrgUnit Groups to review each OrgUnit identified' +
        ' and add the relevant Group allocation.',
    },
    {
        key: 'organisationUnitsViolatingExclusiveGroupSets',
        label: 'Organisation units violating exclusive group sets',
        text: 'Some organisation units have been allocated to several organisation unit groups that are members of' +
        ' the same organisation unit group set. All group sets in DHIS are defined as exclusive, which means that an' +
        ' organisation unit can only be allocated to one organisation unit group within that Group Set. For' +
        ' instance, one organisation unit cannot normally belong to the both the `Hospital` and `Clinic` groups ,' +
        ' but rather to only to one of them. Go to Maintenance -> organisation unit->Organisation unit groups to' +
        ' review each organisation unit identified in the integrity check. Remove the organisation unit from all' +
        ' groups except the one that it should be allocated to.',
    },
    {
        key: 'organisationUnitGroupsWithoutGroupSets',
        label: 'Organisation unit groups without group sets',
        text: 'The organisation unit groups listed here have not been allocated to a group set. Go to' +
        ' Maintenance->Organisation unit->Organisation unit group sets and allocate the Organisation unit group to' +
        ' the appropriate group set.',
    },
    {
        key: 'validationRulesWithoutGroups',
        label: 'Validation rules without groups',
        text: 'All validation rules must be assigned to a group. Go to Services->Data quality->Validation rule group' +
        ' and assign the offending validation rule to a group.',
    },
    {
        key: 'invalidValidationRuleLeftSideExpressions',
        label: 'Invalid validation rule left side expressions',
        text: 'An error exists in the left-side validation rule definition. Go to Services->Data quality->Validation' +
        ' rule and click the "Edit" icon on the offending rule. Press "Edit left side" and make the corrections that' +
        ' are required.',
    },
    {
        key: 'invalidValidationRuleRightSideExpressions',
        label: 'Invalid validation rule right side expressions',
        text: 'An error exists in the right-side validation rule definition. Go to Services->Data quality->Validation' +
        ' rule and click the "Edit" icon on the offending rule. Press "Edit right side" and make the corrections' +
        ' that are required.',
    },
    {
        key: 'invalidProgramIndicatorExpressions',
        label: 'Invalid program indicator expressions',
    },
    {
        key: 'invalidProgramIndicatorFilters',
        label: 'Invalid program indicator filters',
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
        key: 'duplicatePeriods',
        label: 'Duplicate periods',
    },
];
