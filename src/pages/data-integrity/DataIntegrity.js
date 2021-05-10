import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard'
import * as conf from './data.integrity.conf'

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
            <PageHeader
                sectionKey={sectionKey}
                title={i18n.t(i18nKeys.dataIntegrity.title)}
            />
            {(error || poll.error) && (
                <NoticeBox error>
                    {error?.message || poll.error?.message}
                </NoticeBox>
            )}
            {poll.data && <Cards cards={poll.data} />}
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
