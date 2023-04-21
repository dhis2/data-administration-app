import { i18nKeys } from '../i18n-keys.js'
import Analytics from './analytics/Analytics.js'
import DataIntegrity from './data-integrity/DataIntegrity.js'
import DataStatistics from './data-statistics/DataStatistics.js'
import LockExceptions from './lock-exceptions/LockExceptions.js'
import Maintenance from './maintenance/Maintenance.js'
import MinMaxValueGeneration from './min-max-value-generation/MinMaxValueGeneration.js'
import ResourceTables from './resource-tables/ResourceTables.js'

export const sections = [
    {
        key: 'dataIntegrity',
        path: '/data-integrity',
        component: DataIntegrity,
        info: {
            label: i18nKeys.dataIntegrity.label,
            description: i18nKeys.dataIntegrity.description,
            actionText: i18nKeys.dataIntegrity.actionText,
            docs: 'dataAdmin_dataIntegrity',
        },
    },
    {
        key: 'maintenance',
        path: '/maintenance',
        component: Maintenance,
        info: {
            label: i18nKeys.maintenance.label,
            description: i18nKeys.maintenance.description,
            actionText: i18nKeys.maintenance.actionText,
            docs: 'data_admin_maintenance',
        },
    },
    {
        key: 'resourceTables',
        path: '/resourceTables',
        component: ResourceTables,
        info: {
            label: i18nKeys.resourceTables.label,
            description: i18nKeys.resourceTables.description,
            actionText: i18nKeys.resourceTables.actionText,
            docs: 'dataAdmin_resourceTables',
        },
    },
    {
        key: 'analytics',
        path: '/analytics',
        component: Analytics,
        info: {
            label: i18nKeys.analytics.label,
            description: i18nKeys.analytics.description,
            actionText: i18nKeys.analytics.actionText,
            docs: 'analytics_tables_management',
        },
    },
    {
        key: 'statistics',
        path: '/data-statistics',
        component: DataStatistics,
        info: {
            label: i18nKeys.dataStatistics.label,
            description: i18nKeys.dataStatistics.description,
            actionText: i18nKeys.dataStatistics.actionText,
            docs: 'dataAdmin_dataStatistics',
        },
    },
    {
        key: 'lock',
        path: '/lock-exceptions',
        component: LockExceptions,
        info: {
            label: i18nKeys.lockExceptions.label,
            description: i18nKeys.lockExceptions.description,
            actionText: i18nKeys.lockExceptions.actionText,
            docs: 'dataAdmin_lockException',
        },
    },
    {
        key: 'minMax',
        path: '/min-max-value-generation',
        component: MinMaxValueGeneration,
        info: {
            label: i18nKeys.minMaxValueGeneration.label,
            description: i18nKeys.minMaxValueGeneration.description,
            actionText: i18nKeys.minMaxValueGeneration.actionText,
            docs: 'data_admin_min_max_value_generation',
        },
    },
]

export const getDocsKeyForSection = (sectionKey) =>
    sections.find((section) => section.key === sectionKey)?.info.docs || ''
