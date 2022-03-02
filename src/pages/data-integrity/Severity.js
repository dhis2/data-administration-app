import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import React from 'react'
import SeverityPropType from './SeverityPropType'

const severities = {
    INFO: {
        displayName: i18n.t('Information'),
        description: i18n.t('For information only'),
    },
    WARNING: {
        displayName: i18n.t('Warning'),
        description: i18n.t('May be a problem, but not necessarily an error'),
    },
    SEVERE: {
        displayName: i18n.t('Severe'),
        description: i18n.t(
            'An error which should be fixed, but which may not necessarily lead to the system not functioning'
        ),
    },
    CRITICAL: {
        displayName: i18n.t('Critical'),
        description: i18n.t(
            'An error which must be fixed, and which may lead to end-user error or system crashes'
        ),
    },
}

const Severity = ({ severity }) => {
    const { displayName, description } = severities[severity]

    return (
        <Tooltip
            content={description}
            neutral={severity === 'INFO'}
            negative={severity === 'CRITICAL' || severity === 'SEVERE'}
        >
            <Tag>{displayName}</Tag>
        </Tooltip>
    )
}

Severity.propTypes = {
    severity: SeverityPropType.isRequired,
}

export default Severity
