import React from 'react';

/* Material UI */
import { Card, CardText } from 'material-ui/Card';
import { RaisedButton } from 'material-ui';

/* d2-ui */
import { ERROR, LOADING } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

/* Components */
import Page from '../Page';
import NotificationsTable from '../../components/notifications-table/NotificationsTable';
import PageHelper from '../../components/page-helper/PageHelper';

/* Helpers */
import { getDocsKeyForSection } from '../sections.conf';
import {
    PULL_INTERVAL,
    RESOURCE_TABLES_ENDPOINT,
    RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT,
} from '../resource-tables/resource-tables.conf';

// i18n
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* styles */
import pageStyles from '../Page.css';
import styles from './ResourceTables.css';

class ResourceTable extends Page {
    static STATE_PROPERTIES = [
        'loading',
        'notifications',
        'jobId',
        'intervalId',
    ];

    constructor() {
        super();

        this.state = {
            loading: false,
            notifications: [],
            jobId: null,
            intervalId: null,
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

    componentDidMount() {
        this.requestTaskSummary();
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.cancelPoollingRequests();
    }

    cancelPoollingRequests() {
        clearInterval(this.state.intervalId);
    }

    setLoadingPageState() {
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
            },
            pageState: {
                loading: true,
            },
        });
    }

    setLoadedPageWithErrorState(error) {
        const messageError = error && error.message ?
            error.message :
            i18n.t(i18nKeys.resourceTables.unexpectedError);
        this.cancelPoollingRequests();
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

    isAnalyzingTables = () => this.state.jobId && this.state.intervalId;

    startsPooling = () => setInterval(() => {
        this.requestTaskSummary();
    }, PULL_INTERVAL);

    isJobInProgress = jobNotifications => jobNotifications.every(notification => !notification.completed);

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

    updateStateForInProgressJobAccordingTaskSummaryResponse = (taskSummaryResponse) => {
        const notifications = taskSummaryResponse[this.state.jobId] || [];
        const completed = !this.isJobInProgress(notifications);

        if (completed) {
            this.cancelPoollingRequests();
        }

        this.context.updateAppState({
            showSnackbar: !completed,
            pageState: {
                notifications,
                loading: !completed,
            },
        });
    };

    verifyInProgressJobsForTaskSummaryResponseAndUpdateState = (taskSummaryResponse) => {
        const jobIds = taskSummaryResponse ? Object.keys(taskSummaryResponse) : [];

        // looking for the most recent in progress job
        for (let i = jobIds.length - 1; i >= 0; i--) {
            const jobId = jobIds[i];
            const notifications = taskSummaryResponse[jobId] || [];

            // found in progress job: show current notifications and starts pooling
            if (this.isJobInProgress(notifications)) {
                const intervalId = this.startsPooling();

                this.context.updateAppState({
                    showSnackbar: true,
                    snackbarConf: {
                        type: LOADING,
                    },
                    pageState: {
                        notifications,
                        loading: true,
                        jobId,
                        intervalId,
                    },
                });

                break;
            }
        }
    };

    requestTaskSummary() {
        const api = this.context.d2.Api.getApi();
        const lastId = this.state.notifications && this.state.notifications.length > 0
            ? this.state.notifications[0].uid : null;
        const url = lastId ?
            `${RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT}?lastId=${lastId}` : `${RESOURCE_TABLES_TASK_SUMMARY_ENDPOINT}`;

        api.get(url).then((taskSummaryResponse) => {
            /* not mounted finishes */
            if (!this.isPageMounted()) {
                return;
            }

            // showing current job
            if (this.isAnalyzingTables()) {
                this.updateStateForInProgressJobAccordingTaskSummaryResponse(taskSummaryResponse);
                // so far no jobs is being processed, lets check if server is has any in progress job
            } else {
                this.verifyInProgressJobsForTaskSummaryResponseAndUpdateState(taskSummaryResponse);
            }
        }).catch((e) => {
            if (this.isPageMounted()) {
                this.setLoadedPageWithErrorState(e);
            }
        });
    }

    render() {
        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.resourceTables.title) }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card className={pageStyles.cardContainer}>
                    <CardText>
                        <div className={styles.description}>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.organisationUnitStructure)} <span
                                    className={styles.tableName}
                                >
                            (_orgunitstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.organistionUnitCategoryOptionCombo)} <span
                                    className={styles.tableName}
                                >
                            (_orgunitstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.categoryOptionGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_categoryoptiongroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.dataElementGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_dataelementgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.indicatorGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_indicatorgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.organisationUnitGroupSetStructure)} <span
                                    className={styles.tableName}
                                >
                            (_organisationunitgroupsetstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.categoryStructure)} <span
                                    className={styles.tableName}
                                >
                            (_categorystructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.dataElementCategoryOptionComboName)} <span
                                    className={styles.tableName}
                                >
                            (_categoryoptioncomboname)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.dataElementStructure)} <span
                                    className={styles.tableName}
                                >
                            (_dataelementstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.periodStructure)} <span
                                    className={styles.tableName}
                                >
                            (_periodstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.dataPeriodStructure)} <span
                                    className={styles.tableName}
                                >
                            (_dateperiodstructure)
                                </span>
                            </div>
                            <div>
                                {i18n.t(i18nKeys.resourceTables.dataElementCategoryOptionCombinations)} <span
                                    className={styles.tableName}
                                >
                            (_dataelementcategoryoptioncombo)
                                </span>
                            </div>
                        </div>
                        <RaisedButton
                            id={'generateTablesBtnId'}
                            primary
                            label={i18n.t(i18nKeys.resourceTables.actionButton)}
                            onClick={this.initResourceTablesGeneration}
                            disabled={this.state.loading}
                        />
                    </CardText>
                </Card>
                {this.state.notifications.length > 0 &&
                    <Card className={pageStyles.cardContainer}>
                        <CardText>
                            <NotificationsTable notifications={this.state.notifications} />
                        </CardText>
                    </Card>
                }
            </div>
        );
    }
}

export default ResourceTable;
