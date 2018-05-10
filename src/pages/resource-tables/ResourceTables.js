import React from 'react';

import { Card, CardText } from 'material-ui/Card';
import { RaisedButton } from 'material-ui';

import { ERROR, LOADING, SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';
import {
    PULL_INTERVAL,
    RESOURCE_TABLES_ENDPOINT,
    RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT,
} from '../resource-tables/resource-tables.conf';

// i18n
import { i18nKeys } from '../../i18n';

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
                message: translator(i18nKeys.resourceTables.loadingMessage),
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
            translator(i18nKeys.resourceTables.unexpectedError);
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
                const jobId = response.response.id;
                const intervalId = setInterval(() => {
                    this.requestTaskSummary();
                }, PULL_INTERVAL);

                this.setState({
                    jobId,
                    intervalId,
                });
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
                                message: translator(i18nKeys.resourceTables.actionPerformed),
                            },
                            pageState: {
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
                    { translator(i18nKeys.resourceTables.title) }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card>
                    <CardText>
                        <div className={styles.description}>
                            <div>
                                {translator(i18nKeys.resourceTables.organisationUnitStructure)} <span
                                    className={styles.tableName}
                                >
                            (_orgunitstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.organistionUnitCategoryOptionCombo)} <span
                                    className={styles.tableName}
                                >
                            (_orgunitstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.categoryOptionGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_categoryoptiongroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.dataElementGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_dataelementgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.indicatorGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_indicatorgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.organisationUnitGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_organisationunitgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.categoryStructure)} <span
                                    className={styles.tableName}
                                >
                            (_categorystructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.dataElementCategoryOptionComboName)} <span
                                    className={styles.tableName}
                                >
                            (_categoryoptioncomboname)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.dataElementStructure)} <span
                                    className={styles.tableName}
                                >
                            (_dataelementstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.periodStructure)} <span
                                    className={styles.tableName}
                                >
                            (_periodstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.dataPeriodStructure)} <span
                                    className={styles.tableName}
                                >
                            (_dateperiodstructure)
                                </span>
                            </div>
                            <div>
                                {translator(i18nKeys.resourceTables.dataElementCategoryOptionCombinations)} <span
                                    className={styles.tableName}
                                >
                            (_dataelementcategoryoptioncombo)
                                </span>
                            </div>
                        </div>
                        <RaisedButton
                            primary
                            label={translator(i18nKeys.resourceTables.actionButton)}
                            onClick={this.initResourceTablesGeneration}
                            disabled={this.state.loading}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default ResourceTable;
