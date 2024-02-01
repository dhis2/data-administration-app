
import i18n from '@dhis2/d2-i18n'

// our locales use _ instead of - for locales
const language = i18n.language?.replace('_', '-') || 'en'

export const [selectedLocale] = Intl.DateTimeFormat.supportedLocalesOf([
    language,
    'en',
])

// not sure if there can be discrepancies between supported locales
// between DateTimeFormat and RelativeTimeFormat, but do this for safety
export const [relativeTimeLocale] = Intl.RelativeTimeFormat.supportedLocalesOf([
    language,
    'en',
])

const units = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 },
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat(relativeTimeLocale, {
    numeric: 'always',
})

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime
 * @param from     - the dateTime of reference
 */
export function getRelativeTime(
    relative,
    from = new Date()
) {
    const delta = relative.getTime() - from.getTime()
    return getRelativeTimeFromDelta(delta)
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param delta  - the elapsed time in milliseconds, negative if in the past
 */
export function getRelativeTimeFromDelta(delta) {
    // get closest unit
    const absoluteDelta = Math.abs(delta)
    for (const { unit, ms } of units) {
        if (absoluteDelta >= ms || unit === 'second') {
            return relativeTimeFormatter.format(Math.round(delta / ms), unit)
        }
    }
    return ''
}
