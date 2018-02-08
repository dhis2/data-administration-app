import React from 'react';

import { Card, CardText } from 'material-ui';
import * as conf from './data.integrity.conf';

import Page from '../Page';
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard';
import { ERROR, LOADING, SUCCESS } from '../../components/feedback-snackbar/SnackbarTypes';

class DataIntegrity extends Page {
    constructor(props, context) {
        super(props, context);
        this.state.cards = this.state.cards || {};
    }

    componentDidMount() {
        if (!this.context.loading && !this.context.pageState) {
            this.initDataIntegrityCheck();
        }
    }

    componentWillUnmount() {
        if (this.context && this.context.pageState && this.context.pageState.intervalId) {
            clearInterval(this.context.pageState.intervalId);
        }
    }

    setLoadingPageState(id) {
        const translator = this.context.t;
        this.context.updateAppState({
            loading: true,
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator('Performing data integrity checks.'),
            },
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: false,
                intervalId: id,
            },
        });
    }

    setLoadedPageWithErrorState(error) {
        const translator = this.context.t;
        const messageError = error && error.message ?
            error.message :
            translator('An unexpected error happened during data integrity checks.');
        this.context.updateAppState({
            loading: false,
            showSnackbar: true,
            snackbarConf: {
                type: ERROR,
                message: messageError,
            },
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: true,
            },
        });
    }

    initDataIntegrityCheck() {
        const api = this.context.d2.Api.getApi();
        this.setLoadingPageState();
        api.post(conf.INIT_ENDPOINT).then(() => {
            this.setLoadingPageState(
                setInterval(() => { this.requestTaskStatus(); }, conf.PULL_INTERVAL),
            );
        }).catch((e) => {
            this.setLoadedPageWithErrorState(e);
        });
    }

    requestTaskStatus() {
        const api = this.context.d2.Api.getApi();
        api.get(conf.PULL_ENDPOINT).then((response) => {
            if (response.length) {
                this.loadData();
            }
        }).catch((e) => {
            this.setLoadedPageWithErrorState(e);
        });
    }

    loadData() {
        const api = this.context.d2.Api.getApi();
        const translator = this.context.t;
        api.get(conf.DATA_ENDPOINT).then((response) => {
            this.context.updateAppState({
                loading: false,
                showSnackbar: true,
                snackbarConf: {
                    type: SUCCESS,
                    message: translator('Data integrity checks performed with success.'),
                },
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: true,
                    cards: response,
                },
            });
        }).catch((e) => {
            this.setLoadedPageWithErrorState(e);
        });
    }

    render() {
        const noContent = (
            <Card>
                <CardText>{ this.context.t(this.state.loading ? 'Loading...' : 'No data to show.') }</CardText>
            </Card>
        );
        const errorElementskeys = Object.keys(this.state.cards);
        let cardsToShow = [];
        if (errorElementskeys.length) {
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
        }
        if (this.context.pageState && this.context.pageState.loaded) {
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
        return (
            <div className="page-wrapper">
                <h1>{ this.context.t('Data Integrity') }</h1>
                {cardsToShow && cardsToShow.length > 0 ? cardsToShow : noContent}
            </div>
        );
    }
}

export default DataIntegrity;
