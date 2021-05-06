import i18n from '@dhis2/d2-i18n'
import {
    ERROR,
    LOADING,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DocsLink from '../../components/DocsLink/DocsLink'
import { i18nKeys } from '../../i18n-keys'
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard'
import * as conf from './data.integrity.conf'
import styles from './DataIntegrity.module.css'

class DataIntegrity extends Component {
    /*componentWillUnmount() {
        super.componentWillUnmount()
        this.cancelPullingRequests()
    }

    cancelPullingRequests() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    setLoadingPageState() {
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.dataIntegrity.performing),
            },
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: false,
                loading: true,
            },
        })
    }

    setLoadedPageWithErrorState(error) {
        const messageError =
            error && error.message
                ? error.message
                : i18n.t(i18nKeys.dataIntegrity.unexpectedError)
        this.cancelPullingRequests()
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ERROR,
                message: messageError,
            },
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: true,
                loading: false,
            },
        })
    }

    initDataIntegrityCheck = () => {
        const api = this.context.d2.Api.getApi()
        this.setLoadingPageState()
        api.post(conf.INIT_ENDPOINT)
            .then(response => {
                if (this.isPageMounted() && response) {
                    const jobId = response.response.id
                    this.intervalId = setInterval(() => {
                        this.requestTaskSummary(jobId)
                    }, conf.PULL_INTERVAL)
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    requestTaskSummary(jobId) {
        const api = this.context.d2.Api.getApi()
        const url = `${conf.DATA_ENDPOINT}/${jobId}`
        api.get(url)
            .then(response => {
                if (this.isPageMounted()) {
                    if (response) {
                        this.cancelPullingRequests()
                        this.context.updateAppState({
                            showSnackbar: false,
                            currentSection: this.props.sectionKey,
                            pageState: {
                                loaded: true,
                                cards: response,
                                loading: false,
                            },
                        })
                    }
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }*/

    render() {
        const runButton = (
            <Button
                primary
                disabled={this.props.loading}
                onClick={this.initDataIntegrityCheck}
            >
                {i18n.t(i18nKeys.dataIntegrity.actionButton)}
            </Button>
        )
        let cardsToShow = []
        if (this.props.cards) {
            const errorElementskeys = Object.keys(this.props.cards)
            cardsToShow = errorElementskeys.map(element => {
                const control = conf.dataIntegrityControls.find(
                    control => control.key === element
                )
                if (!control) {
                    return null
                }
                return (
                    <DataIntegrityCard
                        cardId={`errorElement-${element}`}
                        key={element}
                        title={control.label}
                        content={this.props.cards[element]}
                    />
                )
            })
            if (this.props.loaded) {
                const noErrors = conf.dataIntegrityControls
                    .filter(
                        element => errorElementskeys.indexOf(element.key) < 0
                    )
                    .map(resultNoErrorElement => (
                        <DataIntegrityCard
                            cardId={`noErrorElement-${resultNoErrorElement.key}`}
                            key={resultNoErrorElement.key}
                            title={resultNoErrorElement.label}
                            content={[]}
                        />
                    ))
                cardsToShow.push(noErrors)
            }
        }
        return (
            <>
                <h1 className={styles.header}>
                    {i18n.t(conf.PAGE_TITLE)}
                    <DocsLink sectionKey={this.props.sectionKey} />
                </h1>
                {cardsToShow?.length > 0 ? cardsToShow : runButton}
            </>
        )
    }
}

DataIntegrity.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DataIntegrity
