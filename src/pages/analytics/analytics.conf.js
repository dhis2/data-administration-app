import i18n from '@dhis2/d2-i18n'
import { i18nKeys } from '../../i18n-keys'

export const ANALYTICS_TABLES_ENDPOINT = 'resourceTables/analytics'
export const PULL_INTERVAL = 5000
export const ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT =
    'system/tasks/ANALYTICS_TABLE'
export const DEFAULT_LAST_YEARS = '-1'
export const LAST_YEARS_INPUT_KEY = 'lastYears'

const LAST_YEAR = 10
const FIRST_YEAR = 1

const lastYearValues = [
    {
        key: DEFAULT_LAST_YEARS,
        value: DEFAULT_LAST_YEARS,
        displayName: i18n.t('All'),
    },
]

/* Last years dropdown options */
for (let i = FIRST_YEAR; i <= LAST_YEAR; i++) {
    lastYearValues.push({
        key: String(i),
        value: String(i),
        displayName: String(i),
    })
}

export const lastYearElements = lastYearValues

/* Form checkboxes */
export const analyticsCheckboxes = [
    'skipAggregate',
    'skipResourceTables',
    'skipEvents',
    'skipEnrollment',
].map(key => ({
    key,
    label: i18nKeys.analytics.checkboxes[key],
}))
