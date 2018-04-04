export const i18nKeys = {
    dataIntegrity: {
        title: 'Data Integrity',
        label: 'Data Integrity',
        description: 'Run data integrity checks and unveil anomalies and problems in the meta data setup.',
        actionText: 'Check Data Integrity',
        performing: 'Performing data integrity checks...',
        unexpectedError: 'An unexpected error happened during data integrity checks',
        actionButton: 'RUN INTEGRITY CHECKS',
        dataElementsWithoutDataSet: {
            label: 'Data elements without data set',
        },
        dataElementsWithoutGroups: {
            label: 'Data elements without groups',
        },
        dataElementsViolatingExclusiveGroupSets: {
            label: 'Data elements violating exclusive group sets',
        },
        dataElementsAssignedToDataSetsWithDifferentPeriodTypes: {
            label: 'Data elements assigned to data sets with different period types',
        },
        dataSetsNotAssignedToOrganisationUnits: {
            label: 'Data sets not assigned to organisation units',
        },
        indicatorsWithIdenticalFormulas: {
            label: 'Indicators with identical formulas',
        },
        indicatorsWithoutGroups: {
            label: 'Indicators without groups',
        },
        invalidIndicatorNumerators: {
            label: 'Invalid indicator numerators',
        },
        invalidIndicatorDenominators: {
            label: 'Invalid indicator denominators',
        },
        indicatorsViolatingExclusiveGroupSets: {
            label: 'Indicators violating exclusive group sets',
        },
        organisationUnitsWithCyclicReferences: {
            label: 'Organisation units with cyclic references',
        },
        orphanedOrganisationUnits: {
            label: 'Orphaned organisation units',
        },
        organisationUnitsWithoutGroups: {
            label: 'Organisation units without groups',
        },
        organisationUnitsViolatingExclusiveGroupSets: {
            label: 'Organisation units violating exclusive group sets',
        },
        organisationUnitGroupsWithoutGroupSets: {
            label: 'Organisation unit groups without group sets',
        },
        validationRulesWithoutGroups: {
            label: 'Validation rules without groups',
        },
        invalidValidationRuleLeftSideExpressions: {
            label: 'Invalid validation rule left side expressions',
        },
        invalidValidationRuleRightSideExpressions: {
            label: 'Invalid validation rule right side expressions',
        },
        invalidProgramIndicatorExpressions: {
            label: 'Invalid program indicator expressions',
        },
        invalidProgramIndicatorFilters: {
            label: 'Invalid program indicator filters',
        },
        dataElementsInDataSetNotInForm: {
            label: 'There are data elements in the form, but not in the form or sections',
        },
        invalidCategoryCombos: {
            label: 'Invalid category combinations',
        },
        duplicatePeriods: {
            label: 'Duplicate periods',
        },
    },
    maintenance: {
        title: 'Maintenance',
        label: 'Maintenance',
        description: 'Perform maintenance tasks and generate resource database tables for the organisation unit' +
        ' hierarchy and group set structure.',
        actionText: 'Perform Maintenance',
        actionButton: 'PERFORM MAINTENANCE',
        performing: 'Performing Maintenance...',
        actionPerformed: 'Maintenance done',
        unexpectedError: 'An unexpected error happened during maintenance',
        analyticsTableClear: 'Clear analytics tables',
        analyticsTableAnalyze: 'Analyze analytics tables',
        zeroDataValueRemoval: 'Remove zero data values',
        softDeletedDataValueRemoval: 'Permanently remove soft deleted data values',
        softDeletedEventRemoval: 'Permanently remove soft deleted events',
        softDeletedEnrollmentRemoval: 'Permanently remove soft deleted enrollments',
        softDeletedTrackedEntityInstanceRemoval: 'Permanently remove soft deleted tracked entity instances',
        periodPruning: 'Prune periods',
        expiredInvitationsClear: 'Remove expired invitations',
        sqlViewsDrop: 'Drop SQL views',
        sqlViewsCreate: 'Create SQL views',
        categoryOptionComboUpdate: 'Update category option combinations',
        ouPathsUpdate: 'Update organisation unit paths',
        cacheClear: 'Clear application cache',
        appReload: 'Reload apps',
        resourceTables: 'Generate resource tables',
    },
    dataStatistics: {
        label: 'Data Statistics',
        description: 'Browse the number of objects in the database, like data elements, indicators,' +
        ' data sets and data values.',
        actionText: 'Overview Data Statistics',
    },
    lockException: {
        label: 'Lock Exception',
        description: 'Add or remove exceptions to the the standard rules for locking of data entry forms.',
        actionText: 'Lock Exception Management',
    },
    minMaxValueGeneration: {
        label: 'Min-Max Value Generation',
        description: 'Generate min-max values which can be used for data validation during data entry and ' +
        'validation processes.',
        actionText: 'Generate Min-Max Value',
    },
    messages: {
        unexpectedError: 'An unexpected error happened during operation',
    },
};

export default i18nKeys;
