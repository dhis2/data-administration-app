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
    lastRun: {
        label: i18n.t('Last run'),
        value: 'lastRun',
        sorter: (a, b) => {
            if (!a.runInfo?.finishedTime || !b.runInfo?.finishedTime) {
                return SORT['A-Z'].sorter(a, b)
            }
            return (
                new Date(b.runInfo.finishedTime) -
                new Date(a.runInfo.finishedTime)
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
