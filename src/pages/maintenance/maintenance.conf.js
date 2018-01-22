export const RESOURCE_TABLES_OPTION_KEY = 'home';

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
