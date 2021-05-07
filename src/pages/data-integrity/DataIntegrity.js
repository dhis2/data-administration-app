import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import DocsLink from '../../components/DocsLink/DocsLink'
import { i18nKeys } from '../../i18n-keys'
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard'
import * as conf from './data.integrity.conf'
import styles from './DataIntegrity.module.css'

const Cards = ({ cards }) => {
    const errorElementskeys = Object.keys(cards)
    const cardsToShow = errorElementskeys.map(element => {
        const control = conf.dataIntegrityControls.find(
            control => control.key === element
        )
        if (!control) {
            return null
        }
        return (
            <DataIntegrityCard
                key={element}
                cardId={`errorElement-${element}`}
                title={control.label}
                content={cards[element]}
            />
        )
    })
    const noErrors = conf.dataIntegrityControls
        .filter(element => errorElementskeys.indexOf(element.key) < 0)
        .map(resultNoErrorElement => (
            <DataIntegrityCard
                key={resultNoErrorElement.key}
                cardId={`noErrorElement-${resultNoErrorElement.key}`}
                title={resultNoErrorElement.label}
                content={[]}
            />
        ))
    cardsToShow.push(noErrors)

    return cardsToShow
}

const startDataIntegrityCheckMutation = {
    resource: 'dataIntegrity',
    type: 'create',
}

const pollQuery = {
    poll: {
        resource: 'system/taskSummaries/DATA_INTEGRITY',
        id: ({ jobId }) => jobId,
    },
}

const usePoll = (fn, pollInterval) => {
    const intervalId = useRef(null)

    const start = (...args) => {
        intervalId.current = setInterval(() => fn(...args), pollInterval)
    }
    const cancel = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current)
        }
    }

    useEffect(() => {
        return cancel
    }, [])

    return { start, cancel }
}

const useDataIntegrityPoll = () => {
    const { refetch, error, data } = useDataQuery(pollQuery, { lazy: true })
    const poll = usePoll(jobId => {
        refetch({ jobId })
    }, conf.PULL_INTERVAL)

    useEffect(() => {
        if (data?.poll) {
            poll.cancel()
        }
    }, [data])

    return {
        ...poll,
        error,
        data: data?.poll,
    }
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
            <h1 className={styles.header}>
                {i18n.t(i18nKeys.dataIntegrity.title)}
                <DocsLink sectionKey={sectionKey} />
            </h1>
            {(error || poll.error) && (
                <NoticeBox error>{error || poll.error}</NoticeBox>
            )}
            {isPolling && (
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            )}
            {poll.data && <Cards cards={poll.data} />}
            <Button
                primary
                disabled={loading}
                onClick={handleStartDataIntegrityCheck}
            >
                {loading ? (
                    <>
                        {i18n.t('Checking data integrity...')}
                        <CircularLoader small />
                    </>
                ) : (
                    i18n.t(i18nKeys.dataIntegrity.actionButton)
                )}
            </Button>
        </>
    )
}

DataIntegrity.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataIntegrity
