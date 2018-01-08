// Components
import HomePage from '../pages/homepage/Homepage';
import DataIntegrity from '../pages/DataIntegrity';
import Maintenance from '../pages/maintenance/Maintenance';
import ResourceTable from '../pages/resource-table/ResourceTable';
import DataStatistics from '../pages/data-statistics/DataStatistics';
import LockException from '../pages/LockException';
import MinMaxValueGeneration from '../pages/MinMaxValueGeneration';
import Scheduling from '../pages/Scheduling';

export const HOME_SECTION_KEY = 'home';
export const DATA_INTEGRITY_SECTION_KEY = 'dataIntegrity';
export const MAINTENANCE_SECTION_KEY = 'maintenance';
export const RESOURCE_TABLE_SECTION_KEY = 'resourceTable';
export const LOCALE_SECTION_KEY = 'locale';
export const SQL_VIEW_SECTION_KEY = 'sqlView';
export const DATA_STATISTICS_SECTION_KEY = 'statistics';
export const LOCK_EXCEPTION_SECTION_KEY = 'lock';
export const MIN_MAX_VALUE_GENERATION_SECTION_KEY = 'minMax';
export const SCHEDULING_SECTION_KEY = 'schedule';

export const sections = [
    {
        key: HOME_SECTION_KEY,
        label: 'Home',
        icon: 'home',
        path: '/',
        component: HomePage,
    },
    {
        key: DATA_INTEGRITY_SECTION_KEY,
        label: 'Data Integrity',
        icon: 'filter_list',
        description: 'Run data integrity checks and unveil anomalies and problems in the meta data setup.',
        path: '/data-integrity',
        component: DataIntegrity,
    },
    {
        key: MAINTENANCE_SECTION_KEY,
        label: 'Maintenance',
        icon: 'settings',
        description: 'Perform maintenance tasks such as pruning of data values and periods and clearing of database resource tables.',
        path: '/maintenance',
        component: Maintenance,
    },
    {
        key: RESOURCE_TABLE_SECTION_KEY,
        label: 'Resource Table',
        icon: 'view_list',
        description: 'Generate resource database tables for the organisation unit hierarchy and group set structure among others.',
        path: '/resource-table',
        component: ResourceTable,
    },
    {
        key: DATA_STATISTICS_SECTION_KEY,
        label: 'Data Statistics',
        icon: 'pie_chart',
        description: 'Browse the number of objects in the database, like data elements, indicators, data sets and data values.',
        path: '/data-statistics',
        component: DataStatistics,
    },
    {
        key: LOCK_EXCEPTION_SECTION_KEY,
        label: 'Lock Exception',
        icon: 'lock',
        description: 'Add or remove exceptions to the the standard rules for locking of data entry forms.',
        path: '/lock-exception',
        component: LockException,
    },
    {
        key: MIN_MAX_VALUE_GENERATION_SECTION_KEY,
        label: 'Min-Max Value Generation',
        icon: 'compare-arrows',
        description: 'Generate min-max values which can be used for data validation during data entry and validation processes.',
        path: '/min-max-value-generation',
        component: MinMaxValueGeneration,
    },
    {
        key: SCHEDULING_SECTION_KEY,
        label: 'Scheduling',
        icon: 'schedule',
        description: 'Manage scheduled tasks such as data mart exports, where you can set period types, aggregation level and frequency.',
        path: '/schedule',
        component: Scheduling,
    },
];
