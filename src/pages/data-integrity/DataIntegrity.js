import React from 'react';

import { Card, CardText } from 'material-ui';
import * as conf from './data.integrity.conf';

import Page from '../Page';
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard';
import { ERROR, LOADING, SUCCESS } from '../../components/feedback-snackbar/SnackbarTypes';

const STATE_PROPERTIES_WHITE_LIST = [
    'cards',
    'intervalId',
    'loaded',
];

class DataIntegrity extends Page {
    constructor() {
        super();

        this.state = {
            cards: {},
            intervalId: null,
            loaded: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && STATE_PROPERTIES_WHITE_LIST.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    componentDidMount() {
        if (!this.context.loading) {
            this.initDataIntegrityCheck();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.cancelPullingRequests();
    }

    cancelPullingRequests() {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
    }

    setLoadingPageState(id) {
        const translator = this.context.translator;
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
        const translator = this.context.translator;
        const messageError = error && error.message ?
            error.message :
            translator('An unexpected error happened during data integrity checks.');
        this.cancelPullingRequests();
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
                this.cancelPullingRequests();
                this.loadData();
            }
        }).catch((e) => {
            this.setLoadedPageWithErrorState(e);
        });
    }

    loadData() {
        const api = this.context.d2.Api.getApi();
        const translator = this.context.translator;
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
        const translator = this.context.translator;
        const noContent = (
            <Card>
                <CardText>{ translator(this.state.loading ? 'Loading...' : 'No data to show.') }</CardText>
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
        return (
            <div className="page-wrapper">
                <h1>{ translator('Data Integrity') }</h1>
                {cardsToShow && cardsToShow.length > 0 ? cardsToShow : noContent}
            </div>
        );
    }
}

export default DataIntegrity;
