import i18n from './locales/index.js'

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
            softDeletedTrackedEntityRemoval: i18n.t(
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
        title: i18n.t('Resource Tables'),
        label: i18n.t('Resource Tables'),
        description: i18n.t(
            'Generate resource database tables for the organisation unit hierarchy and group set structure among others.'
        ),
        actionText: i18n.t('Generate Resource Tables'),
        unexpectedError: i18n.t(
            'An unexpected error happened during operation'
        ),
        tables: {
            organisationUnitStructure: i18n.t('Organisation unit structure'),
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
            dataSetOrganisationUnitCategory: i18n.t(
                'Data set organisation unit category'
            ),
        },
    },
    analytics: {
        title: i18n.t('Analytics tables management'),
        label: i18n.t('Analytics Tables'),
        description: i18n.t(
            'The data mart is a set of tables in the DHIS database which is used by all reporting and analysis tools to retrieve data from.'
        ),
        actionText: i18n.t('Analytics tables update'),
        unexpectedError: i18n.t(
            'An unexpected error happened during maintenance'
        ),
        checkboxes: {
            skipAggregate: i18n.t(
                'Skip generation of aggregate data and completeness data'
            ),
            skipResourceTables: i18n.t('Skip generation of resource tables'),
            skipEvents: i18n.t('Skip generation of event data'),
            skipEnrollment: i18n.t('Skip generation of enrollment data'),
            skipOrgUnitOwnership: i18n.t(
                'Skip generation of organisation unit ownership data'
            ),
            skipTrackedEntities: i18n.t(
                'Skip generation of tracked entity data'
            ),
            skipOutliers: i18n.t('Skip generation of outlier data'),
        },
    },
    dataStatistics: {
        title: i18n.t('Data Statistics'),
        label: i18n.t('Data Statistics'),
        description: i18n.t(
            'Browse the number of objects in the database, like data elements, indicators, data sets and data values.'
        ),
        actionText: i18n.t('Overview Data Statistics'),
    },
    lockExceptions: {
        title: i18n.t('Lock Exception Management'),
        label: i18n.t('Lock Exception'),
        description: i18n.t(
            'Add or remove exceptions to the the standard rules for locking of data entry forms.'
        ),
        actionText: i18n.t('Lock Exception Management'),
    },
    minMaxValueGeneration: {
        title: i18n.t('Min-Max Value Generation'),
        label: i18n.t('Min-Max Value Generation'),
        description: i18n.t(
            'Generate min-max values which can be used for data validation during data entry and validation processes.'
        ),
        actionText: i18n.t('Generate Min-Max Values'),
    },
}

export default i18nKeys
