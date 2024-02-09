import i18n from '@dhis2/d2-i18n'

export const severityTranslations = {
    CRITICAL: i18n.t('Critical'),
    SEVERE: i18n.t('Severe'),
    WARNING: i18n.t('Warning'),
    INFO: i18n.t('Info'),
}

export const getSeverityTranslation = (severity) => {
    const mappedTranslation = severityTranslations[severity]

    if (mappedTranslation) {
        return mappedTranslation
    }

    return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
}
