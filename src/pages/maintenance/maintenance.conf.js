export const RESOURCE_TABLES_OPTION_KEY = 'home';

export const PAGE_TITLE = 'Maintenance';

export const PAGE_SUMMARY = 'The data maintenance module has five options, each described below.';

export const maintenanceCheckboxes = [
    {
        key: 'analyticsTableClear',
        label: 'Clear analytics tables',
    },
    {
        key: 'analyticsTableAnalyze',
        label: 'Analyze analytics tables',
    },
    {
        key: 'zeroDataValueRemoval',
        label: 'Remove zero data values',
        text: 'This function removes zero data values from the database. Values registered for data elements with' +
        ' aggregation operator average is not removed, as such values will be significant when aggregating the data,' +
        ' contrary to values registered for data elements with aggregation operator sum. Reducing the number of data' +
        ' values will improve system performance.',
    },
    {
        key: 'softDeletedDataValueRemoval',
        label: 'Permanently remove soft deleted data values',
    },
    {
        key: 'softDeletedEventRemoval',
        label: 'Permanently remove soft deleted events',
    },
    {
        key: 'softDeletedEnrollmentRemoval',
        label: 'Permanently remove soft deleted enrollments',
    },
    {
        key: 'softDeletedTrackedEntityInstanceRemoval',
        label: 'Permanently remove soft deleted tracked entity instances',
    },
    {
        key: 'periodPruning',
        label: 'Prune periods',
        text: 'This function removes all periods which have no registered data values. Reducing the number of' +
        ' periods will improve system performance.',
    },
    {
        key: 'expiredInvitationsClear',
        label: 'Remove expired invitations',
    },
    {
        key: 'sqlViewsDrop',
        label: 'Drop SQL views',
    },
    {
        key: 'sqlViewsCreate',
        label: 'Create SQL views',
    },
    {
        key: 'categoryOptionComboUpdate',
        label: 'Update category option combinations',
    },
    {
        key: 'ouPathsUpdate',
        label: 'Update organisation unit paths',
    },
    {
        key: 'cacheClear',
        label: 'Clear application cache',
    },
    {
        key: 'appReload',
        label: 'Reload apps',
    },
    {
        key: RESOURCE_TABLES_OPTION_KEY,
        label: 'Resource Tables',
    },
];
