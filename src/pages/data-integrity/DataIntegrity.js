import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import Issues from './Issues/Issues'
import { useDataIntegrityPoll } from './use-data-integrity-poll'

const startDataIntegrityCheckMutation = {
    resource: 'dataIntegrity',
    type: 'create',
}

const DataIntegrity = ({ sectionKey }) => {
    const [
        handleStartDataIntegrityCheck,
        { loading, error, data },
    ] = useDataMutation(startDataIntegrityCheckMutation)
    const poll = useDataIntegrityPoll()
    const isPolling = data && !poll.data

    useEffect(() => {
        if (loading || !data) {
            return
        }

        const { id: jobId } = data.response
        poll.start(jobId)
    }, [loading, data])

    return (
        <>
            <PageHeader
                sectionKey={sectionKey}
                title={i18nKeys.dataIntegrity.title}
            />
            {(error || poll.error) && (
                <NoticeBox error>
                    {error?.message || poll.error?.message}
                </NoticeBox>
            )}
            {poll.data && <Issues issues={poll.data} />}
            <Button
                primary
                disabled={loading || isPolling}
                onClick={handleStartDataIntegrityCheck}
            >
                {loading || isPolling ? (
                    <>
                        {i18n.t('Checking data integrity...')}
                        <CircularLoader small />
                    </>
                ) : (
                    i18n.t('Run integrity checks')
                )}
            </Button>
        </>
    )
}

DataIntegrity.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataIntegrity
