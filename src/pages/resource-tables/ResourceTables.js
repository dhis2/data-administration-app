import React from 'react';

import { RaisedButton } from 'material-ui';

import { ERROR, LOADING, SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';
import {
    PULL_INTERVAL, RESOURCE_TABLES_ENDPOINT,
    RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT,
} from '../resource-tables/resource-tables.conf';

import styles from './ResourceTables.css';

class ResourceTable extends Page {
    static STATE_PROPERTIES = [
        'loading',
    ];

    constructor() {
        super();

        this.state = {
            intervalId: null,
            loading: false,
        };

        this.initResourceTablesGeneration = this.initResourceTablesGeneration.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && ResourceTable.STATE_PROPERTIES.includes(property)) {
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
                message: translator('Generating Resource Tables...'),
            },
            pageState: {
                loading: true,
            },
        });
    }

    setLoadedPageWithErrorState(error) {
        const translator = this.context.translator;
        const messageError = error && error.message ?
            error.message :
            translator('An unexpected error happened during operation');
        this.cancelPullingRequests();
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ERROR,
                message: messageError,
            },
            pageState: {
                loaded: true,
                loading: false,
            },
        });
    }

    initResourceTablesGeneration() {
        const api = this.context.d2.Api.getApi();
        this.setLoadingPageState();
        api.post(RESOURCE_TABLES_ENDPOINT).then((response) => {
            if (this.isPageMounted() && response) {
                this.state.jobId = response.id;
                this.state.intervalId = setInterval(() => {
                    this.requestTaskSummary();
                }, PULL_INTERVAL);
            }
        }).catch((e) => {
            if (this.isPageMounted()) {
                this.setLoadedPageWithErrorState(e);
            }
        });
    }

    requestTaskSummary() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        const url = `${RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT}/${this.state.jobId}`;
        api.get(url).then((response) => {
            if (this.isPageMounted() && response) {
                for (let i = 0; i < response.length; i++) {
                    const notification = response[i];
                    if (notification.completed) {
                        this.cancelPullingRequests();
                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: SUCCESS,
                                message: translator('Resource Tables generated'),
                            },
                            pageState: {
                                checkboxes: this.state.checkboxes,
                                loading: false,
                            },
                        });
                        break;
                    }
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
        return (
            <div>
                <h1>
                    { translator('Resource Tables') }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <div className={styles.description}>
                    <div>
                        {translator('Organisation unit structure')} <span className={styles.tableName}>
                            (_orgunitstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Organisation unit category option combo')} <span className={styles.tableName}>
                            (_orgunitstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Category option group set structure')} <span className={styles.tableName}>
                            (_categoryoptiongroupsetstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Data element group set structure')} <span className={styles.tableName}>
                            (_dataelementgroupsetstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Indicator group set structure')} <span className={styles.tableName}>
                            (_indicatorgroupsetstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Organisation unit group set structure')} <span className={styles.tableName}>
                            (_organisationunitgroupsetstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Category structure')} <span className={styles.tableName}>
                            (_categorystructure)
                        </span>
                    </div>
                    <div>
                        {translator('Data element category option combo name')} <span className={styles.tableName}>
                            (_categoryoptioncomboname)
                        </span>
                    </div>
                    <div>
                        {translator('Data element structure')} <span className={styles.tableName}>
                            (_dataelementstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Period structure')} <span className={styles.tableName}>
                            (_periodstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Date period structure')} <span className={styles.tableName}>
                            (_dateperiodstructure)
                        </span>
                    </div>
                    <div>
                        {translator('Data element category option combinations')} <span className={styles.tableName}>
                            (_dataelementcategoryoptioncombo)
                        </span>
                    </div>
                </div>
                <RaisedButton
                    primary
                    label={translator('GENERATE TABLES')}
                    onClick={this.initResourceTablesGeneration}
                    disabled={this.state.loading}
                />
            </div>
        );
    }
}

export default ResourceTable;
