import { i18nKeys } from '../../i18n';

export const MAINTENANCE_ENDPOINT = 'maintenance';
export const PAGE_TITLE = i18nKeys.maintenance.title;

export const maintenanceCheckboxes = [
    {
        key: 'analyticsTableClear',
        label: i18nKeys.maintenance.analyticsTableClear,
    },
    {
        key: 'analyticsTableAnalyze',
        label: i18nKeys.maintenance.analyticsTableAnalyze,
    },
    {
        key: 'zeroDataValueRemoval',
        label: i18nKeys.maintenance.zeroDataValueRemoval,
    },
    {
        key: 'softDeletedDataValueRemoval',
        label: i18nKeys.maintenance.softDeletedDataValueRemoval,
    },
    {
        key: 'softDeletedEventRemoval',
        label: i18nKeys.maintenance.softDeletedEventRemoval,
    },
    {
        key: 'softDeletedEnrollmentRemoval',
        label: i18nKeys.maintenance.softDeletedEnrollmentRemoval,
    },
    {
        key: 'softDeletedTrackedEntityInstanceRemoval',
        label: i18nKeys.maintenance.softDeletedTrackedEntityInstanceRemoval,
    },
    {
        key: 'periodPruning',
        label: i18nKeys.maintenance.periodPruning,
    },
    {
        key: 'expiredInvitationsClear',
        label: i18nKeys.maintenance.expiredInvitationsClear,
    },
    {
        key: 'sqlViewsDrop',
        label: i18nKeys.maintenance.sqlViewsDrop,
    },
    {
        key: 'sqlViewsCreate',
        label: i18nKeys.maintenance.sqlViewsCreate,
    },
    {
        key: 'categoryOptionComboUpdate',
        label: i18nKeys.maintenance.categoryOptionComboUpdate,
    },
    {
        key: 'ouPathsUpdate',
        label: i18nKeys.maintenance.ouPathsUpdate,
    },
    {
        key: 'cacheClear',
        label: i18nKeys.maintenance.cacheClear,
    },
    {
        key: 'appReload',
        label: i18nKeys.maintenance.appReload,
    },
];
