import i18n from '@dhis2/d2-i18n'
import { i18nKeys } from '../../i18n-keys.js'

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
    'skipOrgUnitOwnership',
].map((key) => ({
    key,
    label: i18nKeys.analytics.checkboxes[key],
}))
