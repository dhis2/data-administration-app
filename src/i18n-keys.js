export const i18nKeys = {
    dataIntegrity: {
        title: 'Data Integrity',
        label: 'Data Integrity',
        description:
            'Run data integrity checks and unveil anomalies and problems in the meta data setup.',
        actionText: 'Check Data Integrity',
        performing: 'Performing data integrity checks...',
        unexpectedError:
            'An unexpected error happened during data integrity checks',
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
            label:
                'Data elements assigned to data sets with different period types',
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
            label:
                'There are data elements in the form, but not in the form or sections',
        },
        invalidCategoryCombos: {
            label: 'Invalid category combinations',
        },
        duplicatePeriods: {
            label: 'Duplicate periods',
        },
        programRulesWithNoCondition: {
            label: 'Program rules with no condition',
        },
        programRulesWithNoAction: {
            label: 'Program rules with no action',
        },
        programRulesWithNoPriority: {
            label: 'Program rules with no priority',
        },
        programRuleVariablesWithNoDataElement: {
            label: 'Program rule variables with no data element',
        },
        programRuleVariablesWithNoAttribute: {
            label: 'Program rule variables with no attribute',
        },
        programRuleActionsWithNoDataObject: {
            label: 'Program rule actions with no data object',
        },
        programRuleActionsWithNoNotification: {
            label: 'Program rule actions with no notification',
        },
        programRuleActionsWithNoSectionId: {
            label: 'Program rule actions with no section id',
        },
        programRuleActionsWithNoStageId: {
            label: 'Program rule actions with no stage id',
        },
        programIndicatorsWithNoExpression: {
            label: 'Program indicators wit no expression',
        },
    },
    maintenance: {
        title: 'Maintenance',
        label: 'Maintenance',
        description:
            'Perform maintenance tasks and generate resource database tables for the organisation unit' +
            ' hierarchy and group set structure.',
        actionText: 'Perform Maintenance',
        actionButton: 'PERFORM MAINTENANCE',
        performing: 'Performing Maintenance...',
        actionPerformed: 'Maintenance done',
        unexpectedError: 'An unexpected error happened during maintenance',
        analyticsTableClear: 'Clear analytics tables',
        analyticsTableAnalyze: 'Analyze analytics tables',
        zeroDataValueRemoval: 'Remove zero data values',
        softDeletedDataValueRemoval:
            'Permanently remove soft deleted data values',
        softDeletedEventRemoval: 'Permanently remove soft deleted events',
        softDeletedEnrollmentRemoval:
            'Permanently remove soft deleted enrollments',
        softDeletedTrackedEntityInstanceRemoval:
            'Permanently remove soft deleted tracked entity instances',
        periodPruning: 'Prune periods',
        expiredInvitationsClear: 'Remove expired invitations',
        sqlViewsDrop: 'Drop SQL views',
        sqlViewsCreate: 'Create SQL views',
        categoryOptionComboUpdate: 'Update category option combinations',
        ouPathsUpdate: 'Update organisation unit paths',
        cacheClear: 'Clear application cache',
        appReload: 'Reload apps',
    },
    resourceTables: {
        title: 'Resource Tables',
        label: 'Resource Tables',
        description:
            'Generate resource database tables for the organisation unit hierarchy and group ' +
            'set structure among others.',
        actionText: 'Generate Resource Tables',
        actionButton: 'GENERATE TABLES',
        actionPerformed: 'Resource Tables generated',
        unexpectedError: 'An unexpected error happened during operation',
        organisationUnitStructure: 'Organisation unit structure',
        organistionUnitCategoryOptionCombo:
            'Organisation unit category option combo',
        categoryOptionGroupSetStructure: 'Category option group set structure',
        dataElementGroupSetStructure: 'Data element group set structure',
        indicatorGroupSetStructure: 'Indicator group set structure',
        organisationUnitGroupSetStructure:
            'Organisation unit group set structure',
        categoryStructure: 'Category structure',
        dataElementCategoryOptionComboName:
            'Data element category option combo name',
        dataElementStructure: 'Data element structure',
        periodStructure: 'Period structure',
        dataPeriodStructure: 'Date period structure',
        dataElementCategoryOptionCombinations:
            'Data element category option combinations',
    },
    dataStatistics: {
        title: 'Data Statistics',
        label: 'Data Statistics',
        description:
            'Browse the number of objects in the database, like data elements, indicators,' +
            ' data sets and data values.',
        actionText: 'Overview Data Statistics',
        loadingMessage: 'Loading Data Statistics...',
        errorMessage: 'It was not possible to load Data Statistics',
        noDataMessage: 'No data to show.',
        objectType: 'Object type',
        lastHour: 'Last hour',
        today: 'Today',
        last: 'Last',
        days: 'days',
        usersLoggedIn: 'Users logged in',
        userAccountInvitations: 'User account invitations',
        pedingInvitations: 'Pending invitations',
        expiredInvitations: 'Expired invitations',
        dataValues: 'Data values',
        events: 'Events',
        objects: {
            indicator: 'Indicators',
            period: 'Periods',
            programStageInstance: 'Events',
            organisationUnit: 'Organisation units',
            validationRule: 'Validation rules',
            dataValue: 'Data values',
            program: 'Programs',
            dataElement: 'Data elements',
            organisationUnitGroup: 'Organisation unit groups',
            reportTable: 'Pivot tables',
            indicatorType: 'Indicator types',
            dataSet: 'Data sets',
            userGroup: 'User groups',
            user: 'Users',
            map: 'Maps',
            indicatorGroup: 'Indicator groups',
            chart: 'Charts',
            dataElementGroup: 'Data element groups',
            dashboard: 'Dashboards',
        },
    },
    lockException: {
        title: 'Lock Exception Management',
        batchDeletionHeader: 'Lock Exception',
        batchDeletionSubHeader: 'Batch Deletion',
        addLockExceptionFormTitle: 'Add new lock exception',
        label: 'Lock Exception',
        description:
            'Add or remove exceptions to the the standard rules for locking of data entry forms.',
        actionText: 'Lock Exception Management',
        actionButton: 'BATCH DELETION',
        cancelButton: 'CANCEL',
        addButton: 'ADD',
        noDataMessage: 'No data to show.',
        loadingMessage: 'Loading Lock Exceptions...',
        addingMessage: 'Adding Lock Exception...',
        removedMessage: 'Lock Exception removed',
        addedMessage: 'Lock Exception Added',
        confirmDeleteMessage: 'Are you sure?',
        confirmButton: 'CONFIRM',
        selectADataSet: 'Select a Data Set',
        updatingTree: 'Updating Organisation Units Tree...',
        organisationUnitsWithin: 'For organisation units within',
        period: 'Period',
        dataSet: 'Data Set',
        organisationUnit: 'Organisation Unit',
        organisationUnitGroup: 'Organisation Unit Group',
        organisationUnitLevel: 'Organisation Unit Level',
        select: 'Select',
        deselect: 'Deselect',
        selectAll: 'Select All Org Units',
        deselectAll: 'Deselect All Org Units',
        name: 'Name',
        show: 'Show Details',
        remove: 'Remove',
        actions: 'Actions',
        ofPage: 'of',
        week: 'week',
        month: 'month',
        year: 'year',
        biMonth: 'bi monthly',
        day: 'day',
        jan: 'jan',
        feb: 'feb',
        mar: 'mar',
        apr: 'apr',
        may: 'may',
        jun: 'jun',
        jul: 'jul',
        aug: 'aug',
        sep: 'sep',
        oct: 'oct',
        nov: 'nov',
        dec: 'dec',
        janFeb: 'jan-feb',
        marApr: 'mar-apr',
        mayJun: 'may-jun',
        julAug: 'jul-aug',
        sepOct: 'sep-oct',
        novDec: 'nov-dec',
        quarter: 'quarter',
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4',
        sixMonth: 'six monthly',
        janJun: 'jan-jun',
        julDec: 'jul-dec',
        aprSep: 'apr-sep',
        octMar: 'oct-mar',
        selectOrganisationUnits: 'For all organisation units:',
    },
    minMaxValueGeneration: {
        title: 'Min-Max Value Generation',
        label: 'Min-Max Value Generation',
        description:
            'Generate min-max values which can be used for data validation during data entry and ' +
            'validation processes.',
        actionText: 'Generate Min-Max Value',
        notPossibleToLoadMessage: 'It was not possible to load data',
        performingMessage: 'Doing Min Max generation...',
        removingMessage: 'Removing Min Max generation...',
        minMaxGenerationDone: 'Min Max generation done',
        minMaxRemovalDone: 'Min Max removal done',
        dataSet: 'Data Set',
        loadingDataSetsMessage: 'Loading data sets',
        organisationUnitSelect: 'Organisation Unit Selection',
        updatingTree: 'Updating Organisation Units Tree...',
        actionButton: 'Generate',
        removeButton: 'Remove',
    },
    analytics: {
        title: 'Analytics tables management',
        label: 'Analytics Tables',
        description:
            'The data mart is a set of tables in the DHIS database which is used by all reporting and ' +
            'analysis tools to retrieve data from. ',
        actionText: 'Analytics tables update',
        actionButton: 'START EXPORT',
        skipAggregate:
            'Skip generation of aggregate data and completeness data',
        skipResourceTables: 'Skip generation of resource tables',
        skipEvents: 'Skip generation of event data',
        skipEnrollment: 'Skip generation of enrollment data',
        analyticsTablesUpdateHeader: 'Analytics Tables Update',
        lastYearsLabel: 'Number of last years of data to include',
        allLastYears: '[ All ]',
        unexpectedError: 'An unexpected error happened during maintenance',
    },
    messages: {
        unexpectedError: 'An unexpected error happened during operation',
    },
    d2UiComponents: {
        settings: 'Settings',
        app_search_placeholder: 'Search apps',
        profile: 'Profile',
        account: 'Account',
        help: 'Help',
        log_out: 'Log out',
        about_dhis2: 'About DHIS 2',
        manage_my_apps: 'Manage my apps',
        no_results_found: 'No results found',
        interpretations: 'Interpretations',
        messages: 'Messages',
    },
}

export default i18nKeys
