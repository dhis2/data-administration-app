import React from 'react';

import * as conf from './data.integrity.conf';

import Page from '../Page';
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard';

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
        if (this.context && this.context.pageState && this.context.pageState.timeoutId) {
            clearTimeout(this.context.pageState.timeoutId);
        }
    }

    setLoadingPageState(id) {
        this.context.updateAppState({
            loading: true,
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: false,
                timeoutId: id,
            },
        });
    }

    setLoadedPageState() {
        this.context.updateAppState({
            loading: false,
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
                setTimeout(() => { this.requestTaskStatus(); }, conf.PULL_INTERVAL),
            );
        }).catch(() => {
            // TODO: show error
            this.setLoadedPageState();
        });
    }

    requestTaskStatus() {
        const api = this.context.d2.Api.getApi();
        api.get(conf.PULL_ENDPOINT).then((response) => {
            if (!response.length) {
                this.setLoadingPageState(
                    setTimeout(() => { this.requestTaskStatus(); }, conf.PULL_INTERVAL),
                );
            } else {
                this.loadData();
                this.setLoadingPageState();
            }
        }).catch(() => {
            // TODO: show error
            this.setLoadedPageState();
        });
    }

    loadData() {
        const api = this.context.d2.Api.getApi();
        api.get(conf.DATA_ENDPOINT).then((response) => {
            this.context.updateAppState({
                loading: false,
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: true,
                    cards: response,
                },
            });
        }).catch(() => {
            // TODO: show error
            this.setLoadedPageState();
        });
    }

    render() {
        // TODO: No content... message...
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
                {cardsToShow}
            </div>
        );
    }
}

export default DataIntegrity;
