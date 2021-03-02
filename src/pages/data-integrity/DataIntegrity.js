import {
    ERROR,
    LOADING,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { RaisedButton } from 'material-ui'
import React from 'react'
import PageHelper from '../../components/page-helper/PageHelper'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import Page from '../Page'
import { getDocsKeyForSection } from '../sections.conf'
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard'
import * as conf from './data.integrity.conf'
import styles from './DataIntegrity.module.css'

class DataIntegrity extends Page {
    static STATE_PROPERTIES = ['cards', 'loaded', 'loading']

    constructor() {
        super()

        this.state = {
            cards: null,
            intervalId: null,
            loaded: false,
            loading: false,
        }

        this.initDataIntegrityCheck = this.initDataIntegrityCheck.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (DataIntegrity.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property]
            }
        })

        this.setState(nextState)
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        this.cancelPullingRequests()
    }

    cancelPullingRequests() {
        clearInterval(this.state.intervalId)
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

    initDataIntegrityCheck() {
        const api = this.context.d2.Api.getApi()
        this.setLoadingPageState()
        api.post(conf.INIT_ENDPOINT)
            .then(response => {
                if (this.isPageMounted() && response) {
                    this.state.jobId = response.response.id
                    this.state.intervalId = setInterval(() => {
                        this.requestTaskSummary()
                    }, conf.PULL_INTERVAL)
                }
            })
            .catch(e => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(e)
                }
            })
    }

    requestTaskSummary() {
        const api = this.context.d2.Api.getApi()
        const url = `${conf.DATA_ENDPOINT}/${this.state.jobId}`
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
    }

    render() {
        const runButton = (
            <RaisedButton
                id={'runDataIntegrityChecksBtnId'}
                label={i18n.t(i18nKeys.dataIntegrity.actionButton)}
                onClick={this.initDataIntegrityCheck}
                primary
                disabled={this.state.loading}
            />
        )
        let cardsToShow = []
        if (this.state.cards) {
            const errorElementskeys = Object.keys(this.state.cards)
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
                        content={this.state.cards[element]}
                    />
                )
            })
            if (this.state.loaded) {
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
            <div>
                <h1 className={styles.header}>
                    {i18n.t(conf.PAGE_TITLE)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                {cardsToShow && cardsToShow.length > 0
                    ? cardsToShow
                    : runButton}
            </div>
        )
    }
}

export default DataIntegrity
