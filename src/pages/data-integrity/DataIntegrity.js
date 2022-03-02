import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, Button, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.js'
import { i18nKeys } from '../../i18n-keys.js'
import styles from './DataIntegrity.module.css'
import Section from './Section.js'

const query = {
    checks: {
        resource: 'dataIntegrity',
    },
}

const groupChecks = (checks) =>
    checks.reduce((groupedChecks, check) => {
        if (!(check.section in groupedChecks)) {
            groupedChecks[check.section] = []
        }
        groupedChecks[check.section].push(check)
        return groupedChecks
    }, {})

const DataIntegrity = () => {
    const { loading, error, data } = useDataQuery(query)
    const [selectedChecks, setSelectedChecks] = useState(new Set())
    // XXX
    const [submitting, setSubmitting] = useState(false)

    const startDataIntegrityCheck = () => {
        setSubmitting(true)
    }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <NoticeBox
                title={i18n.t('Failed to load available data integrity checks')}
                error
                className={styles.noticeBox}
            >
                {error.message}
            </NoticeBox>
        )
    }

    const groupedChecks = groupChecks(data.checks)

    return (
        <>
            {Object.entries(groupedChecks).map(([section, checks]) => (
                <Section
                    key={section}
                    name={section}
                    checks={checks}
                    selectedChecks={selectedChecks}
                    setSelectedChecks={setSelectedChecks}
                />
            ))}
            <Button
                primary
                disabled={selectedChecks.size === 0}
                loading={submitting}
                onClick={startDataIntegrityCheck}
            >
                {submitting
                    ? i18n.t('Checking data integrity...')
                    : i18n.t('Run integrity checks')}
            </Button>
        </>
    )
}

const DataIntegrityPage = ({ sectionKey }) => (
    <>
        <PageHeader
            sectionKey={sectionKey}
            title={i18nKeys.dataIntegrity.title}
        />
        <DataIntegrity />
    </>
)

DataIntegrityPage.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataIntegrityPage
