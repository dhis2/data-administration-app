import { i18nKeys } from '../../i18n';

/* Constants */
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

/* Notification Table Styles */
export const SUCCESS_COLOR = '#8ac542';
export const INFO_COLOR = '#000000';
export const ERROR_COLOR = '#ff0000';

export const ERROR_NOTIFICATION_ICON = 'error';
export const SUCCESS_NOTIFICATION_ICON = 'check';

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
    infoStyle: {
        color: INFO_COLOR,
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
    row: Object.assign({}, analyticsStyles.rowStyle, analyticsStyles.infoStyle),
};

export const notificationStylesInfo = notificationStyles;

/* helper methods */

/* FIXME think of using an third party library for that, converting for a standard time format defined by design team */
export const formatDateFromServer = (dateFromServer) => {
    if (dateFromServer) {
        return `${dateFromServer.slice(0, 10)} ${dateFromServer.slice(11, 19)}`;
    }

    return '';
};
