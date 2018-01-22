// Components
import HomePage from './home/Home';
import DataIntegrity from './DataIntegrity';
import MaintenancePage from './maintenance/MaintenancePage';
import DataStatistics from './data-statistics/DataStatistics';
import LockException from './LockException';
import MinMaxValueGeneration from './MinMaxValueGeneration';

export const HOME_SECTION_KEY = 'home';
export const DATA_INTEGRITY_SECTION_KEY = 'dataIntegrity';
export const MAINTENANCE_SECTION_KEY = 'maintenance';
export const RESOURCE_TABLE_SECTION_KEY = 'resourceTable';
export const DATA_STATISTICS_SECTION_KEY = 'statistics';
export const LOCK_EXCEPTION_SECTION_KEY = 'lock';
export const MIN_MAX_VALUE_GENERATION_SECTION_KEY = 'minMax';

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
            actionText: 'Check Data Integrity',
        },
    },
    {
        key: MAINTENANCE_SECTION_KEY,
        path: '/maintenance',
        component: MaintenancePage,
        info: {
            label: 'Maintenance',
            icon: 'settings',
            description: 'Perform maintenance tasks and generate resource database tables for the organisation unit' +
            ' hierarchy and group set structure.',
            actionText: 'Perform Maintenance',
        },
    },
    {
        key: DATA_STATISTICS_SECTION_KEY,
        path: '/data-statistics',
        component: DataStatistics,
        info: {
            label: 'Data Statistics',
            icon: 'timeline',
            description: 'Browse the number of objects in the database, like data elements, indicators,' +
            ' data sets and data values.',
            actionText: 'Overview Data Statistics',
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
            actionText: 'Lock Exception Management',
        },
    },
    {
        key: MIN_MAX_VALUE_GENERATION_SECTION_KEY,
        path: '/min-max-value-generation',
        component: MinMaxValueGeneration,
        info: {
            label: 'Min-Max Value Generation',
            icon: 'compare_arrows',
            description: 'Generate min-max values which can be used for data validation during data entry and ' +
            'validation processes.',
            actionText: 'Generate Min-Max Value',
        },
    },
];
