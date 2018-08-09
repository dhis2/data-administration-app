import { i18nKeys } from '../../i18n';

/* Constants */
export const ANALYTICS_TABLES_ENDPOINT = 'resourceTables/analytics';
export const PULL_INTERVAL = 5000;
export const ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT = 'system/tasks/ANALYTICS_TABLE';

export const DEFAULT_LAST_YEARS = -1;
export const LAST_YEARS_INPUT_KEY = 'lastYears';

const LAST_YEAR = 10;
const FIRST_YEAR = 1;

const lastYearValues = [{
    key: DEFAULT_LAST_YEARS,
    value: DEFAULT_LAST_YEARS,
    displayName: i18nKeys.analytics.allLastYears,
}];

/* Last years dropdown options */
for (let i = FIRST_YEAR; i <= LAST_YEAR; i++) {
    lastYearValues.push({
        key: i,
        value: i,
        displayName: i,
    });
}

export const lastYearElements = lastYearValues;

/* Form checkboxes */
export const analyticsCheckboxes = [
    {
        key: 'skipAggregate',
        label: i18nKeys.analytics.skipAggregate,
    },
    {
        key: 'skipResourceTables',
        label: i18nKeys.analytics.skipResourceTables,
    },
    {
        key: 'skipEvents',
        label: i18nKeys.analytics.skipEvents,
    },
    {
        key: 'skipEnrollment',
        label: i18nKeys.analytics.skipEnrollment,
    },
];
