import React from 'react';

import { RaisedButton } from 'material-ui';

import { ERROR, LOADING } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import { getDocsKeyForSection } from '../sections.conf';
import * as conf from './data.integrity.conf';

// i18n
import { i18nKeys } from '../../i18n';

import Page from '../Page';
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard';
import PageHelper from '../../components/page-helper/PageHelper';

import styles from './DataIntegrity.css';

class DataIntegrity extends Page {
    static STATE_PROPERTIES = [
        'cards',
        'loaded',
        'loading',
    ];

    constructor() {
        super();

        this.state = {
            cards: null,
            intervalId: null,
            loaded: false,
            loading: false,
        };

        this.initDataIntegrityCheck = this.initDataIntegrityCheck.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && DataIntegrity.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.cancelPullingRequests();
    }

    cancelPullingRequests() {
        clearInterval(this.state.intervalId);
    }

    setLoadingPageState() {
        const translator = this.context.translator;
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator(i18nKeys.dataIntegrity.performing),
            },
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: false,
                loading: true,
            },
        });
    }

    setLoadedPageWithErrorState(error) {
        const translator = this.context.translator;
        const messageError = error && error.message ?
            error.message :
            translator(i18nKeys.dataIntegrity.unexpectedError);
        this.cancelPullingRequests();
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
        });
    }

    initDataIntegrityCheck() {
        const api = this.context.d2.Api.getApi();
        this.setLoadingPageState();
        api.post(conf.INIT_ENDPOINT).then((response) => {
            if (this.isPageMounted() && response) {
                this.state.jobId = response.response.id;
                this.state.intervalId = setInterval(() => {
                    this.requestTaskSummary();
                }, conf.PULL_INTERVAL);
            }
        }).catch((e) => {
            if (this.isPageMounted()) {
                this.setLoadedPageWithErrorState(e);
            }
        });
    }

    requestTaskSummary() {
        const api = this.context.d2.Api.getApi();
        const url = `${conf.DATA_ENDPOINT}/${this.state.jobId}`;
        api.get(url).then((response) => {
            if (this.isPageMounted()) {
                if (response) {
                    this.cancelPullingRequests();
                    this.context.updateAppState({
                        showSnackbar: false,
                        currentSection: this.props.sectionKey,
                        pageState: {
                            loaded: true,
                            cards: response,
                            loading: false,
                        },
                    });
                }
            }
        }).catch((e) => {
            if (this.isPageMounted()) {
                this.setLoadedPageWithErrorState(e);
            }
        });
    }

    render() {
        const translator = this.context.translator;
        const runButton = (
            <RaisedButton
                label={translator(i18nKeys.dataIntegrity.actionButton)}
                onClick={this.initDataIntegrityCheck}
                primary={Boolean(true)}
                disabled={this.state.loading}
            />
        );
        let cardsToShow = [];
        if (this.state.cards) {
            const errorElementskeys = Object.keys(this.state.cards);
            cardsToShow = errorElementskeys.map(element => (
                <DataIntegrityCard
                    key={element}
                    title={
                        conf.dataIntegrityControls.find(
                            control => control.key === element).label
                    }
                    content={this.state.cards[element]}
                />
            ));
            if (this.state.loaded) {
                const noErrors = conf.dataIntegrityControls
                    .filter(
                        element => errorElementskeys.indexOf(element.key) < 0,
                    ).map(
                        resultNoErrorElement => (
                            <DataIntegrityCard
                                key={resultNoErrorElement.key}
                                title={resultNoErrorElement.label}
                                content={[]}
                            />
                        ),
                    );
                cardsToShow.push(noErrors);
            }
        }
        return (
            <div>
                <h1 className={styles.header}>
                    { translator(conf.PAGE_TITLE) }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                {cardsToShow && cardsToShow.length > 0 ? cardsToShow : runButton}
            </div>
        );
    }
}

export default DataIntegrity;
