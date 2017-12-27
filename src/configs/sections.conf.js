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
      icon: 'home'
    },
    {
      key: DATA_INTEGRITY_SECTION_KEY,
      label: 'Data Integrity',
      icon: 'filter_list',
      description: 'Run data integrity checks and unveil anomalies and problems in the meta data setup.'
    },
    {
      key: MAINTENANCE_SECTION_KEY,
      label: 'Maintenance',
      icon: 'settings',
      description: 'Perform maintenance tasks such as pruning of data values and periods and clearing of database resource tables.'
    },
    {
      key: RESOURCE_TABLE_SECTION_KEY,
      label: 'Resource Table',
      icon: 'view_list',
      description: 'Generate resource database tables for the organisation unit hierarchy and group set structure among others.'
    },
    {
      key: LOCALE_SECTION_KEY,
      label: 'Locale',
      icon: 'library_books',
      description: 'Create and manage locales for database content. A locale is a combination of language and country.'
    },
    {
      key: SQL_VIEW_SECTION_KEY,
      label: 'SQL View',
      icon: 'assessment',
      description: 'Create SQL database views. These views will typically use the resource tables to provide convenient views for third-party tools.'
    },
    {
      key: DATA_STATISTICS_SECTION_KEY,
      label: 'Data Statistics',
      icon: 'pie_chart',
      description: 'Browse the number of objects in the database, like data elements, indicators, data sets and data values.'
    },
    {
      key: LOCK_EXCEPTION_SECTION_KEY,
      label: 'Lock Exception',
      icon: 'lock',
      description: 'Add or remove exceptions to the the standard rules for locking of data entry forms.'
    },
    {
      key: MIN_MAX_VALUE_GENERATION_SECTION_KEY,
      label: 'Min-Max Value Generation',
      icon: 'compare-arrows',
      description: 'Generate min-max values which can be used for data validation during data entry and validation processes.'
    },
    {
      key: SCHEDULING_SECTION_KEY,
      label: 'Scheduling',
      icon: 'schedule',
      description: 'Manage scheduled tasks such as data mart exports, where you can set period types, aggregation level and frequency.'
    }
];
