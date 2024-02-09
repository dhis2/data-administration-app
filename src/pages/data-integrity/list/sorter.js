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
                INFO: 0,
                WARNING: 1,
                SEVERE: 2,
                CRITICAL: 3,
            }
            const severityDiffs =
                (severityOrder[b.severity] || -1) -
                (severityOrder[a.severity] || -1)
            // sort by section if severity is the same
            if (severityDiffs === 0) {
                return SORT.section.sorter(a, b)
            }
            return severityDiffs
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
                return SORT.section.sorter(a, b)
            }
            return b.runInfo.count - a.runInfo.count
        },
    },
}

export const SORT_OPTIONS = Object.values(SORT).map((sort) => ({
    label: sort.label,
    value: sort.value,
}))
