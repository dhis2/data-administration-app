import i18n from '@dhis2/d2-i18n'

export const SORT = {
    'A-Z': {
        label: i18n.t('A-Z'),
        value: 'A-Z',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    section: {
        label: i18n.t('Section'),
        value: 'section',
        sorter: (a, b) => a.section.localeCompare(b.section),
    },
    severity: {
        label: i18n.t('Severity'),
        value: 'severity',
        sorter: (a, b) => {
            const severityOrder = {
                CRITICAL: 0,
                SEVERE: 1,
                WARNING: 2,
                INFO: 3,
            }
            return (
                (severityOrder[a.severity] || 100) -
                (severityOrder[b.severity] || 100)
            )
        },
    },
    errors: {
        label: i18n.t('Number of errors'),
        value: 'errors',
        sorter: (a, b) => {
            if (
                a.runInfo?.count == undefined ||
                b.runInfo?.count == undefined
            ) {
                return SORT['A-Z'].sorter(a, b)
            }
            return b.runInfo.count - a.runInfo.count
        },
    },
}

export const SORT_OPTIONS = Object.values(SORT).map((sort) => ({
    label: sort.label,
    value: sort.value,
}))
