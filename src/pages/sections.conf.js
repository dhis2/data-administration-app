// Components
import HomePage from './homepage/Homepage';
import DataIntegrity from './DataIntegrity';
import MaintenancePage from './maintenance/MaintenancePage';
import ResourceTablePage from './resource-table/ResourceTablePage';
import DataStatistics from './data-statistics/DataStatisticsPage';
import LockException from './LockException';
import MinMaxValueGeneration from './MinMaxValueGeneration';
import Scheduling from './Scheduling';

export const HOME_SECTION_KEY = 'home';
export const DATA_INTEGRITY_SECTION_KEY = 'dataIntegrity';
export const MAINTENANCE_SECTION_KEY = 'maintenance';
export const RESOURCE_TABLE_SECTION_KEY = 'resourceTable';
export const DATA_STATISTICS_SECTION_KEY = 'statistics';
export const LOCK_EXCEPTION_SECTION_KEY = 'lock';
export const MIN_MAX_VALUE_GENERATION_SECTION_KEY = 'minMax';
export const SCHEDULING_SECTION_KEY = 'schedule';

export const sections = [
    {
        key: HOME_SECTION_KEY,
        path: '/',
        component: HomePage,
        info: {
            label: 'Home',
            icon: 'home',
        },
    },
    {
        key: DATA_INTEGRITY_SECTION_KEY,
        path: '/data-integrity',
        component: DataIntegrity,
        info: {
            label: 'Data Integrity',
            icon: 'filter_list',
            description: 'Run data integrity checks and unveil anomalies and problems in the meta data setup.',
        },
    },
    {
        key: MAINTENANCE_SECTION_KEY,
        path: '/maintenance',
        component: MaintenancePage,
        info: {
            label: 'Maintenance',
            icon: 'settings',
            description: 'Perform maintenance tasks such as pruning of data values and periods and clearing of database resource tables.',
        },
    },
    {
        key: RESOURCE_TABLE_SECTION_KEY,
        path: '/resource-table',
        component: ResourceTablePage,
        info: {
            label: 'Resource Table',
            icon: 'view_list',
            description: 'Generate resource database tables for the organisation unit hierarchy and group set structure among others.',
        },
    },
    {
        key: DATA_STATISTICS_SECTION_KEY,
        path: '/data-statistics',
        component: DataStatistics,
        info: {
            label: 'Data Statistics',
            icon: 'pie_chart',
            description: 'Browse the number of objects in the database, like data elements, indicators, data sets and data values.',
        },
    },
    {
        key: LOCK_EXCEPTION_SECTION_KEY,
        path: '/lock-exception',
        component: LockException,
        info: {
            label: 'Lock Exception',
            icon: 'lock',
            description: 'Add or remove exceptions to the the standard rules for locking of data entry forms.',
        },
    },
    {
        key: MIN_MAX_VALUE_GENERATION_SECTION_KEY,
        path: '/min-max-value-generation',
        component: MinMaxValueGeneration,
        info: {
            label: 'Min-Max Value Generation',
            icon: 'compare-arrows',
            description: 'Generate min-max values which can be used for data validation during data entry and validation processes.',
        },
    },
    {
        key: SCHEDULING_SECTION_KEY,
        path: '/schedule',
        component: Scheduling,
        info: {
            label: 'Scheduling',
            icon: 'schedule',
            description: 'Manage scheduled tasks such as data mart exports, where you can set period types, aggregation level and frequency.',
        },
    },
];
