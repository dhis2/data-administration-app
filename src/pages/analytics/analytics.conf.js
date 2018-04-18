import { i18nKeys } from '../../i18n';

export const ANALYTICS_TABLES_ENDPOINT = 'resourceTables/analytics';
export const PULL_INTERVAL = 5000;
export const ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT = 'system/tasks/ANALYTICS_TABLE';

export const DEFAULT_LAST_YEARS = -1;
export const LAST_YEARS_INPUT_KEY = 'lastYears';

export const INFO_LEVEL = 'INFO';
export const ERROR_LEVEL = 'ERROR';
export const SUCCESS_LEVEL = 'SUCCESS';

const LAST_YEAR = 10;
const FIRST_YEAR = 1;

const lastYearValues = [{
    key: DEFAULT_LAST_YEARS,
    value: DEFAULT_LAST_YEARS,
    displayName: i18nKeys.analytics.allLastYears,
}];

for (let i = FIRST_YEAR; i <= LAST_YEAR; i++) {
    lastYearValues.push({
        key: i,
        value: i,
        displayName: i,
    });
}

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

const SUCCESS_COLOR = '#8ac542';
const INFO_COLOR = '#000000';
const ERROR_COLOR = '#ff0000';

const ERROR_NOTIFICATION_ICON = 'error';
const SUCCESS_NOTIFICATION_ICON = 'check';

const FONT_SIZE = 14;

export const analyticsStyles = {
    iconStyle: {
        fontSize: FONT_SIZE,
    },
    rowStyle: {
        fontSize: FONT_SIZE,
        height: 48,
    },
    evenRowStyle: {
        backgroundColor: '#fafafa',
    },
    timeColumnStyle: {
        width: '20%',
    },
    messageColumnStyle: {
        width: '80%',
    },
    successStyle: {
        color: SUCCESS_COLOR,
        fontWeight: 'bold',
    },
    errorStyle: {
        color: ERROR_COLOR,
        fontWeight: 'bold',
    },
};

const notificationStyles = {};
notificationStyles[SUCCESS_LEVEL] = {
    color: SUCCESS_COLOR,
    icon: SUCCESS_NOTIFICATION_ICON,
    row: Object.assign({}, analyticsStyles.rowStyle, analyticsStyles.successStyle),
};

notificationStyles[ERROR_LEVEL] = {
    color: ERROR_COLOR,
    icon: ERROR_NOTIFICATION_ICON,
    row: Object.assign({}, analyticsStyles.rowStyle, analyticsStyles.errorStyle),
};

notificationStyles[INFO_LEVEL] = {
    color: INFO_COLOR,
    row: analyticsStyles.rowStyle,
};

export const notificationStylesInfo = notificationStyles;

export const lastYearElements = lastYearValues;
