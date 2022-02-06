import i18n from './locales'

// The `i18n.t` calls in this file do not perform translation as the user's
// locale is set asynchronously in `index.js`. They are included in this file
// so that `d2-i18n-generate` can extract the string literals.

export const i18nKeys = {
    dataIntegrity: {
        title: i18n.t('Data Integrity'),
        label: i18n.t('Data Integrity'),
        description: i18n.t(
            'Run data integrity checks and unveil anomalies and problems in the meta data setup.'
        ),
        actionText: i18n.t('Check Data Integrity'),
        performing: i18n.t('Performing data integrity checks...'),
        unexpectedError: i18n.t(
            'An unexpected error happened during data integrity checks'
        ),
        actionButton: i18n.t('Run integrity checks'),
        dataElementsWithoutDataSet: {
            label: i18n.t('Data elements without data set'),
        },
        dataElementsWithoutGroups: {
            label: i18n.t('Data elements without groups'),
        },
        dataElementsViolatingExclusiveGroupSets: {
            label: i18n.t('Data elements violating exclusive group sets'),
        },
        dataElementsAssignedToDataSetsWithDifferentPeriodTypes: {
            label: i18n.t(
                'Data elements assigned to data sets with different period types'
            ),
        },
        dataSetsNotAssignedToOrganisationUnits: {
            label: i18n.t('Data sets not assigned to organisation units'),
        },
        indicatorsWithIdenticalFormulas: {
            label: i18n.t('Indicators with identical formulas'),
        },
        indicatorsWithoutGroups: {
            label: i18n.t('Indicators without groups'),
        },
        invalidIndicatorNumerators: {
            label: i18n.t('Invalid indicator numerators'),
        },
        invalidIndicatorDenominators: {
            label: i18n.t('Invalid indicator denominators'),
        },
        indicatorsViolatingExclusiveGroupSets: {
            label: i18n.t('Indicators violating exclusive group sets'),
        },
        organisationUnitsWithCyclicReferences: {
            label: i18n.t('Organisation units with cyclic references'),
        },
        orphanedOrganisationUnits: {
            label: i18n.t('Orphaned organisation units'),
        },
        organisationUnitsWithoutGroups: {
            label: i18n.t('Organisation units without groups'),
        },
        organisationUnitsViolatingExclusiveGroupSets: {
            label: i18n.t('Organisation units violating exclusive group sets'),
        },
        organisationUnitGroupsWithoutGroupSets: {
            label: i18n.t('Organisation unit groups without group sets'),
        },
        validationRulesWithoutGroups: {
            label: i18n.t('Validation rules without groups'),
        },
        invalidValidationRuleLeftSideExpressions: {
            label: i18n.t('Invalid validation rule left side expressions'),
        },
        invalidValidationRuleRightSideExpressions: {
            label: i18n.t('Invalid validation rule right side expressions'),
        },
        invalidProgramIndicatorExpressions: {
            label: i18n.t('Invalid program indicator expressions'),
        },
        invalidProgramIndicatorFilters: {
            label: i18n.t('Invalid program indicator filters'),
        },
        dataElementsInDataSetNotInForm: {
            label: i18n.t(
                'There are data elements in the form, but not in the form or sections'
            ),
        },
        invalidCategoryCombos: {
            label: i18n.t('Invalid category combinations'),
        },
        duplicatePeriods: {
            label: i18n.t('Duplicate periods'),
        },
        programRulesWithNoCondition: {
            label: i18n.t('Program rules with no condition'),
        },
        programRulesWithNoAction: {
            label: i18n.t('Program rules with no action'),
        },
        programRulesWithNoPriority: {
            label: i18n.t('Program rules with no priority'),
        },
        programRuleVariablesWithNoDataElement: {
            label: i18n.t('Program rule variables with no data element'),
        },
        programRuleVariablesWithNoAttribute: {
            label: i18n.t('Program rule variables with no attribute'),
        },
        programRuleActionsWithNoDataObject: {
            label: i18n.t('Program rule actions with no data object'),
        },
        programRuleActionsWithNoNotification: {
            label: i18n.t('Program rule actions with no notification'),
        },
        programRuleActionsWithNoSectionId: {
            label: i18n.t('Program rule actions with no section id'),
        },
        programRuleActionsWithNoStageId: {
            label: i18n.t('Program rule actions with no stage id'),
        },
        programIndicatorsWithNoExpression: {
            label: 'Program indicators wit no expression',
        },
    },
    maintenance: {
        title: i18n.t('Maintenance'),
        label: i18n.t('Maintenance'),
        description: i18n.t(
            'Perform maintenance tasks and generate resource database tables for the organisation unit hierarchy and group set structure.'
        ),
        actionText: i18n.t('Perform Maintenance'),
        actionButton: i18n.t('Perform maintenance'),
        performing: i18n.t('Performing Maintenance...'),
        actionPerformed: i18n.t('Maintenance done'),
        unexpectedError: i18n.t(
            'An unexpected error happened during maintenance'
        ),
        analyticsTableClear: i18n.t('Clear analytics tables'),
        analyticsTableAnalyze: i18n.t('Analyze analytics tables'),
        zeroDataValueRemoval: i18n.t('Remove zero data values'),
        softDeletedDataValueRemoval: i18n.t(
            'Permanently remove soft deleted data values'
        ),
        softDeletedEventRemoval: i18n.t(
            'Permanently remove soft deleted events'
        ),
        softDeletedEnrollmentRemoval: i18n.t(
            'Permanently remove soft deleted enrollments'
        ),
        softDeletedTrackedEntityInstanceRemoval: i18n.t(
            'Permanently remove soft deleted tracked entity instances'
        ),
        periodPruning: i18n.t('Prune periods'),
        expiredInvitationsClear: i18n.t('Remove expired invitations'),
        sqlViewsDrop: i18n.t('Drop SQL views'),
        sqlViewsCreate: i18n.t('Create SQL views'),
        categoryOptionComboUpdate: i18n.t(
            'Update category option combinations'
        ),
        ouPathsUpdate: i18n.t('Update organisation unit paths'),
        cacheClear: i18n.t('Clear application cache'),
        appReload: i18n.t('Reload apps'),
    },
    resourceTables: {
        title: i18n.t('Resource Tables'),
        label: i18n.t('Resource Tables'),
        description: i18n.t(
            'Generate resource database tables for the organisation unit hierarchy and group set structure among others.'
        ),
        actionText: i18n.t('Generate Resource Tables'),
        actionButton: i18n.t('Generate tables'),
        actionPerformed: i18n.t('Resource Tables generated'),
        unexpectedError: i18n.t(
            'An unexpected error happened during operation'
        ),
        organisationUnitStructure: i18n.t('Organisation unit structure'),
        organistionUnitCategoryOptionCombo: i18n.t(
            'Organisation unit category option combo'
        ),
        categoryOptionGroupSetStructure: i18n.t(
            'Category option group set structure'
        ),
        dataElementGroupSetStructure: i18n.t(
            'Data element group set structure'
        ),
        indicatorGroupSetStructure: i18n.t('Indicator group set structure'),
        organisationUnitGroupSetStructure: i18n.t(
            'Organisation unit group set structure'
        ),
        categoryStructure: i18n.t('Category structure'),
        dataElementCategoryOptionComboName: i18n.t(
            'Data element category option combo name'
        ),
        dataElementStructure: i18n.t('Data element structure'),
        periodStructure: i18n.t('Period structure'),
        dataPeriodStructure: i18n.t('Date period structure'),
        dataElementCategoryOptionCombinations: i18n.t(
            'Data element category option combinations'
        ),
    },
    dataStatistics: {
        title: i18n.t('Data Statistics'),
        label: i18n.t('Data Statistics'),
        description: i18n.t(
            'Browse the number of objects in the database, like data elements, indicators, data sets and data values.'
        ),
        actionText: i18n.t('Overview Data Statistics'),
        loadingMessage: i18n.t('Loading Data Statistics...'),
        errorMessage: i18n.t('It was not possible to load Data Statistics'),
        noDataMessage: i18n.t('No data to show.'),
        objectType: i18n.t('Object type'),
        lastHour: i18n.t('Last hour'),
        today: i18n.t('Today'),
        last: i18n.t('Last'),
        days: i18n.t('days'),
        usersLoggedIn: i18n.t('Users logged in'),
        userAccountInvitations: i18n.t('User account invitations'),
        pedingInvitations: i18n.t('Pending invitations'),
        expiredInvitations: i18n.t('Expired invitations'),
        dataValues: i18n.t('Data values'),
        events: i18n.t('Events'),
        objects: {
            indicator: i18n.t('Indicators'),
            period: i18n.t('Periods'),
            programStageInstance: i18n.t('Events'),
            organisationUnit: i18n.t('Organisation units'),
            validationRule: i18n.t('Validation rules'),
            dataValue: i18n.t('Data values'),
            program: i18n.t('Programs'),
            dataElement: i18n.t('Data elements'),
            organisationUnitGroup: i18n.t('Organisation unit groups'),
            reportTable: i18n.t('Pivot tables'),
            indicatorType: i18n.t('Indicator types'),
            dataSet: i18n.t('Data sets'),
            userGroup: i18n.t('User groups'),
            user: i18n.t('Users'),
            map: i18n.t('Maps'),
            indicatorGroup: i18n.t('Indicator groups'),
            chart: i18n.t('Charts'),
            dataElementGroup: i18n.t('Data element groups'),
            dashboard: i18n.t('Dashboards'),
            visualization: i18n.t('Visualization'),
            eventVisualization: i18n.t('Event visualization'),
            programInstance: i18n.t('Program instance'),
            trackedEntityInstance: i18n.t('Tracked entity instance'),
        },
    },
    lockException: {
        title: i18n.t('Lock Exception Management'),
        batchDeletionHeader: i18n.t('Lock Exception'),
        batchDeletionSubHeader: i18n.t('Batch Deletion'),
        addLockExceptionFormTitle: i18n.t('Add new lock exception'),
        label: i18n.t('Lock Exception'),
        description: i18n.t(
            'Add or remove exceptions to the the standard rules for locking of data entry forms.'
        ),
        actionText: i18n.t('Lock Exception Management'),
        actionButton: i18n.t('Batch deletion'),
        cancelButton: i18n.t('Cancel'),
        addButton: i18n.t('Add'),
        noDataMessage: i18n.t('No data to show.'),
        loadingMessage: i18n.t('Loading Lock Exceptions...'),
        addingMessage: i18n.t('Adding Lock Exception...'),
        removedMessage: i18n.t('Lock Exception removed'),
        addedMessage: i18n.t('Lock Exception Added'),
        confirmDeleteMessage: i18n.t('Are you sure?'),
        confirmButton: i18n.t('Confirm'),
        selectADataSet: i18n.t('Select a Data Set'),
        updatingTree: i18n.t('Updating Organisation Units Tree...'),
        organisationUnitsWithin: i18n.t('For organisation units within'),
        period: i18n.t('Period'),
        dataSet: i18n.t('Data Set'),
        organisationUnit: i18n.t('Organisation Unit'),
        organisationUnitGroup: i18n.t('Organisation Unit Group'),
        organisationUnitLevel: i18n.t('Organisation Unit Level'),
        select: i18n.t('Select'),
        deselect: i18n.t('Deselect'),
        selectAll: i18n.t('Select All Org Units'),
        deselectAll: i18n.t('Deselect All Org Units'),
        name: i18n.t('Name'),
        show: i18n.t('Show Details'),
        remove: i18n.t('Remove'),
        actions: i18n.t('Actions'),
        ofPage: i18n.t('of'),
        week: i18n.t('week'),
        month: i18n.t('month'),
        year: i18n.t('year'),
        biMonth: i18n.t('bi monthly'),
        day: i18n.t('day'),
        jan: i18n.t('jan'),
        feb: i18n.t('feb'),
        mar: i18n.t('mar'),
        apr: i18n.t('apr'),
        may: i18n.t('may'),
        jun: i18n.t('jun'),
        jul: i18n.t('jul'),
        aug: i18n.t('aug'),
        sep: i18n.t('sep'),
        oct: i18n.t('oct'),
        nov: i18n.t('nov'),
        dec: i18n.t('dec'),
        janFeb: i18n.t('jan-feb'),
        marApr: i18n.t('mar-apr'),
        mayJun: i18n.t('may-jun'),
        julAug: i18n.t('jul-aug'),
        sepOct: i18n.t('sep-oct'),
        novDec: i18n.t('nov-dec'),
        quarter: i18n.t('quarter'),
        Q1: i18n.t('Q1'),
        Q2: i18n.t('Q2'),
        Q3: i18n.t('Q3'),
        Q4: i18n.t('Q4'),
        sixMonth: i18n.t('six monthly'),
        janJun: i18n.t('jan-jun'),
        julDec: i18n.t('jul-dec'),
        aprSep: i18n.t('apr-sep'),
        octMar: i18n.t('oct-mar'),
        selectOrganisationUnits: i18n.t('For all organisation units:'),
    },
    minMaxValueGeneration: {
        title: i18n.t('Min-Max Value Generation'),
        label: i18n.t('Min-Max Value Generation'),
        description: i18n.t(
            'Generate min-max values which can be used for data validation during data entry and validation processes.'
        ),
        actionText: i18n.t('Generate Min-Max Value'),
        notPossibleToLoadMessage: i18n.t('It was not possible to load data'),
        warningMessage: i18n.t('Select Data set and Organisation Unit'),
        performingMessage: i18n.t('Doing Min Max generation...'),
        removingMessage: i18n.t('Removing Min Max generation...'),
        minMaxGenerationDone: i18n.t('Min Max generation done'),
        minMaxRemovalDone: i18n.t('Min Max removal done'),
        dataSet: i18n.t('Data Set'),
        loadingDataSetsMessage: i18n.t('Loading data sets'),
        organisationUnitSelect: i18n.t('Organisation Unit Selection'),
        updatingTree: i18n.t('Updating Organisation Units Tree...'),
        actionButton: i18n.t('Generate'),
        removeButton: i18n.t('Remove'),
    },
    analytics: {
        title: i18n.t('Analytics tables management'),
        label: i18n.t('Analytics Tables'),
        description: i18n.t(
            'The data mart is a set of tables in the DHIS database which is used by all reporting and analysis tools to retrieve data from.'
        ),
        actionText: i18n.t('Analytics tables update'),
        actionButton: i18n.t('Start export'),
        skipAggregate: i18n.t(
            'Skip generation of aggregate data and completeness data'
        ),
        skipResourceTables: i18n.t('Skip generation of resource tables'),
        skipEvents: i18n.t('Skip generation of event data'),
        skipEnrollment: i18n.t('Skip generation of enrollment data'),
        analyticsTablesUpdateHeader: i18n.t('Analytics Tables Update'),
        lastYearsLabel: i18n.t('Number of last years of data to include'),
        allLastYears: i18n.t('[ All ]'),
        unexpectedError: i18n.t(
            'An unexpected error happened during maintenance'
        ),
    },
    messages: {
        unexpectedError: i18n.t(
            'An unexpected error happened during operation'
        ),
    },
    d2UiComponents: {
        settings: i18n.t('Settings'),
        app_search_placeholder: i18n.t('Search apps'),
        profile: i18n.t('Profile'),
        account: i18n.t('Account'),
        help: i18n.t('Help'),
        log_out: i18n.t('Log out'),
        about_dhis2: i18n.t('About DHIS 2'),
        manage_my_apps: i18n.t('Manage my apps'),
        no_results_found: i18n.t('No results found'),
        interpretations: i18n.t('Interpretations'),
        messages: i18n.t('Messages'),
    },
}

export default i18nKeys
