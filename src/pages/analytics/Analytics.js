import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Card,
    Checkbox,
    SingleSelectField,
    SingleSelectOption,
    NoticeBox,
    CircularLoader,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
import { getUpdatedNotifications } from '../../get-updated-notifications'
import { i18nKeys } from '../../i18n-keys'
import {
    DEFAULT_LAST_YEARS,
    LAST_YEARS_INPUT_KEY,
    lastYearElements,
} from './analytics.conf'
import styles from './Analytics.module.css'
import { useAnalyticsPoll } from './use-analytics-poll'
import { useCheckboxes } from './use-checkboxes'

const startAnalyticsTablesGenerationMutation = {
    resource: 'resourceTables/analytics',
    type: 'create',
    params: params => params,
}

const Analytics = ({ sectionKey }) => {
    const { checkboxes, toggleCheckbox } = useCheckboxes()
    const [lastYears, setLastYears] = useState(DEFAULT_LAST_YEARS)
    const [
        startAnalyticsTablesGeneration,
        { loading, error, data },
    ] = useDataMutation(startAnalyticsTablesGenerationMutation, {
        onComplete: data => {
            const { id: jobId } = data.response
            poll.start({ jobId })
        },
    })
    const poll = useAnalyticsPoll()
    const notifications = poll.data ? getUpdatedNotifications(poll.data) : []
    const isPolling =
        data && (!poll.data || !notifications.some(n => n.completed))

    const handleStartAnalyticsTablesGeneration = () => {
        const params = {}
        for (const [key, checked] of Object.entries(checkboxes)) {
            if (checked) {
                params[key] = true
            }
        }
        if (lastYears !== DEFAULT_LAST_YEARS) {
            params[LAST_YEARS_INPUT_KEY] = lastYears
        }
        startAnalyticsTablesGeneration(params)
    }
    const handleLastYearsChange = ({ selected }) => {
        setLastYears(selected)
    }

    return (
        <>
            <PageHeader
                title={i18nKeys.analytics.title}
                sectionKey={sectionKey}
            />
            <Card className={styles.card}>
                {(error || poll.error) && (
                    <NoticeBox className={styles.noticeBox} error>
                        {error?.message || poll.error.message}
                    </NoticeBox>
                )}
                <div className={styles.form}>
                    <div className={styles.checkboxes}>
                        {Object.entries(checkboxes).map(
                            ([key, { label, checked }]) => (
                                <Checkbox
                                    key={key}
                                    className={styles.checkbox}
                                    label={label}
                                    checked={checked}
                                    onChange={() => {
                                        toggleCheckbox(key)
                                    }}
                                    disabled={loading || isPolling}
                                />
                            )
                        )}
                    </div>
                    <SingleSelectField
                        className={styles.lastYearsSelect}
                        label={i18n.t(
                            'Number of last years of data to include'
                        )}
                        selected={lastYears}
                        onChange={handleLastYearsChange}
                        disabled={loading || isPolling}
                    >
                        {lastYearElements.map(item => (
                            <SingleSelectOption
                                key={item.key}
                                label={item.displayName}
                                value={item.value}
                            />
                        ))}
                    </SingleSelectField>
                </div>
                <Button
                    primary
                    onClick={handleStartAnalyticsTablesGeneration}
                    disabled={loading || isPolling}
                >
                    {loading || isPolling ? (
                        <>
                            {i18n.t('Exporting...')}
                            <CircularLoader small />
                        </>
                    ) : (
                        i18n.t('Start export')
                    )}
                </Button>
                {notifications.length > 0 && (
                    <div className={styles.notificationsTable}>
                        <NotificationsTable
                            notifications={notifications}
                            animateIncomplete
                        />
                    </div>
                )}
            </Card>
        </>
    )
}

Analytics.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default Analytics
