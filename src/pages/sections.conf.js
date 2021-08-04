import { i18nKeys } from '../i18n-keys'
import Analytics from './analytics/Analytics'
import DataIntegrity from './data-integrity/DataIntegrity'
import DataStatistics from './data-statistics/DataStatistics'
import LockExceptions from './lock-exceptions/LockExceptions'
import Maintenance from './maintenance/Maintenance'
import MinMaxValueGeneration from './min-max-value-generation/MinMaxValueGeneration'
import ResourceTables from './resource-tables/ResourceTables'

export const sections = [
    {
        key: 'dataIntegrity',
        path: '/data-integrity',
        component: DataIntegrity,
        info: {
            label: i18nKeys.dataIntegrity.label,
            icon: 'link',
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
            icon: 'settings',
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
            icon: 'view_list',
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
            icon: 'multiline_chart',
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
            icon: 'timeline',
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
            icon: 'lock',
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
            icon: 'compare_arrows',
            description: i18nKeys.minMaxValueGeneration.description,
            actionText: i18nKeys.minMaxValueGeneration.actionText,
            docs: 'dataAdmin_minMaxValueGeneration',
        },
    },
]

export const getDocsKeyForSection = sectionKey =>
    sections.find(section => section.key === sectionKey)?.info.docs || ''
