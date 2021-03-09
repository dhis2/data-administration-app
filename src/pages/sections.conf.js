import { i18nKeys } from '../i18n'
import Analytics from './analytics/Analytics'
import DataIntegrity from './data-integrity/DataIntegrity'
import DataStatistics from './data-statistics/DataStatistics'
import LockException from './lock-exception/LockException'
import Maintenance from './maintenance/Maintenance'
import MinMaxValueGeneration from './min-max-value-generation/MinMaxValueGeneration'
import ResourceTables from './resource-tables/ResourceTables'

export const DATA_INTEGRITY_SECTION_KEY = 'dataIntegrity'
export const MAINTENANCE_SECTION_KEY = 'maintenance'
export const RESOURCE_TABLES_SECTION_KEY = 'resourceTables'
export const DATA_STATISTICS_SECTION_KEY = 'statistics'
export const LOCK_EXCEPTION_SECTION_KEY = 'lock'
export const MIN_MAX_VALUE_GENERATION_SECTION_KEY = 'minMax'
export const ANALYTICS_SECTION_KEY = 'analytics'

export const sections = [
    {
        key: DATA_INTEGRITY_SECTION_KEY,
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
        key: MAINTENANCE_SECTION_KEY,
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
        key: RESOURCE_TABLES_SECTION_KEY,
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
        key: ANALYTICS_SECTION_KEY,
        path: '/analytics',
        component: Analytics,
        info: {
            label: i18nKeys.analytics.label,
            icon: 'multiline_chart',
            description: i18nKeys.analytics.description,
            actionText: i18nKeys.analytics.actionText,
            docs: 'generate_analytics_tables',
        },
    },
    {
        key: DATA_STATISTICS_SECTION_KEY,
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
        key: LOCK_EXCEPTION_SECTION_KEY,
        path: '/lock-exception',
        component: LockException,
        info: {
            label: i18nKeys.lockException.label,
            icon: 'lock',
            description: i18nKeys.lockException.description,
            actionText: i18nKeys.lockException.actionText,
            docs: 'dataAdmin_lockException',
        },
    },
    {
        key: MIN_MAX_VALUE_GENERATION_SECTION_KEY,
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

export const getDocsKeyForSection = sectionKey => {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        if (section.key === sectionKey) {
            return section.info.docs
        }
    }

    return ''
}
