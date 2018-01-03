const maintenanceCheckboxes = [
    { key: 'clearAnalyticsTables', label: 'Clear analytics tables' },
    { key: 'analyzeAnalyticsTables', label: 'Analyze analytics tables' },
    { key: 'removeZeroDataValues', label: 'Remove zero data values' },
    { key: 'permRemoveSoftDeletedValues', label: 'Permanently remove soft deleted data values' },
    { key: 'permRemoveSofDeletedEvents', label: 'Permanently remove soft deleted events' },
    { key: 'permRemoveSoftDeletedEnrollments', label: 'Permanently remove soft deleted enrollments' },
    { key: 'permRemoveSoftDeletedTrackedEntityInstances', label: 'Permanently remove soft deleted tracked entity instances' },
    { key: 'prunePeriods', label: 'Prune periods' },
    { key: 'removeExpiredInvitations', label: 'Remove expired invitations' },
    { key: 'dropSqlViews', label: 'Drop SQL views' },
    { key: 'createSqlViews', label: 'Create SQL views' },
    { key: 'updateCategoryOptionsCombinations', label: 'Update category option combinations' },
    { key: 'updateOrganisationUnitPaths', label: 'Update organisation unit paths' },
    { key: 'clearApplicationCache', label: 'Clear application cache' },
    { key: 'reloadApps', label: 'Reload apps' },
];

export default maintenanceCheckboxes;
