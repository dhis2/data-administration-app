import i18n from '@dhis2/d2-i18n'

export const i18nKeys = {
    dataIntegrity: {
        title: i18n.t('Data Integrity'),
        label: i18n.t('Data Integrity'),
        description: i18n.t(
            'Run data integrity checks and unveil anomalies and problems in the metadata setup.'
        ),
        actionText: i18n.t('Check data integrity'),
        unexpectedError: i18n.t(
            'An unexpected error happened during data integrity checks'
        ),
    },
    maintenance: {
        title: i18n.t('Maintenance'),
        label: i18n.t('Maintenance'),
        description: i18n.t(
            'Perform maintenance tasks and generate resource database tables for the organisation unit hierarchy and group set structure.'
        ),
        actionText: i18n.t('Perform maintenance'),
        checkboxes: {
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
}

export default i18nKeys
