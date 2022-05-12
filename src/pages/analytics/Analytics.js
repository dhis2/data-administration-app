import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Card,
    Checkbox,
    SingleSelectField,
    SingleSelectOption,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import {
    DEFAULT_LAST_YEARS,
    LAST_YEARS_INPUT_KEY,
    lastYearElements,
} from './analytics.conf'
import styles from './Analytics.module.css'
import { useAnalytics } from './use-analytics'
import { useCheckboxes } from './use-checkboxes'

const Analytics = ({ sectionKey }) => {
    const { checkboxes, toggleCheckbox } = useCheckboxes()
    const [lastYears, setLastYears] = useState(DEFAULT_LAST_YEARS)
    const { startAnalyticsTablesGeneration, loading, error, notifications } =
        useAnalytics()

    const handleStartAnalyticsTablesGeneration = () => {
        const params = {}
        for (const [key, { checked }] of Object.entries(checkboxes)) {
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
                {error && (
                    <NoticeBox className={styles.noticeBox} error>
                        {error.message}
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
                                    disabled={loading}
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
                        disabled={loading}
                    >
                        {lastYearElements.map((item) => (
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
                    loading={loading}
                >
                    {loading ? i18n.t('Exporting...') : i18n.t('Start export')}
                </Button>
                {notifications.length > 0 && (
                    <div className={styles.notificationsTable}>
                        <NotificationsTable notifications={notifications} />
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
