import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.js'
import { i18nKeys } from '../../i18n-keys.js'
import Issues from './Issues/Issues.js'
import { useDataIntegrity } from './use-data-integrity.js'

const DataIntegrity = ({ sectionKey }) => {
    const { startDataIntegrityCheck, loading, error, issues } =
        useDataIntegrity()

    return (
        <>
            <PageHeader
                sectionKey={sectionKey}
                title={i18nKeys.dataIntegrity.title}
            />
            {error && <NoticeBox error>{error.message}</NoticeBox>}
            {issues && <Issues issues={issues} />}
            <Button primary loading={loading} onClick={startDataIntegrityCheck}>
                {loading
                    ? i18n.t('Checking data integrity...')
                    : i18n.t('Run integrity checks')}
            </Button>
        </>
    )
}

DataIntegrity.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataIntegrity
