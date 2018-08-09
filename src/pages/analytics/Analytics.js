import React from 'react';

/* Material UI */
import {
    Card,
    CardText,
    GridTile,
    Checkbox,
    SelectField,
    MenuItem,
    RaisedButton,
} from 'material-ui';
import classNames from 'classnames';

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
    ANALYTICS_TABLES_ENDPOINT,
    ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT,
    DEFAULT_LAST_YEARS,
    LAST_YEARS_INPUT_KEY,
    analyticsCheckboxes,
    lastYearElements,
} from '../analytics/analytics.conf';

// i18n
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* styles */
import styles from '../Page.css';

class Analytics extends Page {
    static STATE_PROPERTIES = [
        'checkboxes',
        'loading',
        'lastYears',
        'notifications',
        'jobId',
        'intervalId',
    ];

    constructor() {
        super();

        const checkboxes = {};
        for (let i = 0; i < analyticsCheckboxes.length; i++) {
            const checkbox = analyticsCheckboxes[i];
            checkboxes[checkbox.key] = { checked: false };
        }

        this.state = {
            checkboxes,
            loading: false,
            lastYears: DEFAULT_LAST_YEARS,
            notifications: [],
            jobId: null,
            intervalId: null,
        };

        this.initAnalyticsTablesGeneration = this.initAnalyticsTablesGeneration.bind(this);
        this.onChangeLastYears = this.onChangeLastYears.bind(this);
    }

    componentDidMount() {
        this.requestTaskSummary();
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && Analytics.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
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
                notifications: [],
            },
        });
    }

    setLoadedPageWithErrorState(error) {
        const messageError = error && error.message ?
            error.message :
            i18n.t(i18nKeys.analytics.unexpectedError);
        this.cancelPoollingRequests();
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ERROR,
                message: messageError,
            },
            pageState: {
                loading: false,
            },
        });
    }

    areActionsDisabled() {
        return this.state.loading;
    }

    buildFormData() {
        let formData = null;
        const checkboxKeys = Object.keys(this.state.checkboxes);
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            const checked = this.state.checkboxes[key].checked;
            formData = formData || new FormData();
            formData.append(key, checked);
        }

        if (this.state.lastYears !== DEFAULT_LAST_YEARS) {
            formData.append(LAST_YEARS_INPUT_KEY, this.state.lastYears);
        }

        return formData;
    }

    isAnalyzingTables = () => this.state.jobId && this.state.intervalId;

    startsPooling = () => setInterval(() => {
        this.requestTaskSummary();
    }, PULL_INTERVAL);

    isJobInProgress = jobNotifications => jobNotifications.every(notification => !notification.completed);

    initAnalyticsTablesGeneration() {
        const api = this.context.d2.Api.getApi();
        const formData = this.buildFormData();

        this.setLoadingPageState();
        api.post(ANALYTICS_TABLES_ENDPOINT, formData).then((response) => {
            if (this.isPageMounted() && response) {
                const jobId = response.response.id;
                const intervalId = this.startsPooling();

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
            `${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}?lastId=${lastId}` : `${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}`;
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

    onChangeLastYears(event, index, value) {
        this.setState({
            lastYears: value,
        });
    }

    toggleCheckbox = (initialCheckboxes, key) => () => {
        const checkboxes = Object.assign({}, initialCheckboxes);
        const checkboxState = checkboxes[key].checked;
        checkboxes[key].checked = !checkboxState;
        this.setState({ checkboxes });
    }

    renderCheckbox = checkbox => (
        <GridTile
            key={checkbox.key}
            className={classNames('col-xs-12 col-md-6', styles.formControl)}
        >
            <Checkbox
                label={i18n.t(checkbox.label)}
                checked={this.state.checkboxes[checkbox.key].checked}
                onCheck={this.toggleCheckbox(this.state.checkboxes, checkbox.key)}
                labelStyle={{ color: '#000000' }}
                iconStyle={{ fill: '#000000' }}
                disabled={this.areActionsDisabled()}
            />
        </GridTile>
    );

    render() {
        const gridElements = analyticsCheckboxes.map(this.renderCheckbox);
        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.analytics.title) }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card className={styles.cardContainer}>
                    <CardText>
                        <h4 className={styles.uppercase}>{i18nKeys.analytics.analyticsTablesUpdateHeader}</h4>
                        <div className={classNames(styles.gridContainer, 'row')}>
                            {gridElements}
                            <SelectField
                                disabled={this.areActionsDisabled()}
                                className="col-xs-12 col-md-6"
                                floatingLabelText={
                                    i18n.t(i18nKeys.analytics.lastYearsLabel)
                                }
                                onChange={this.onChangeLastYears}
                                value={this.state.lastYears}
                                fullWidth
                            >
                                {lastYearElements.map(item => (
                                    <MenuItem
                                        key={item.key}
                                        value={item.value}
                                        primaryText={i18n.t(item.displayName)}
                                    />
                                ))}
                            </SelectField>
                        </div>
                        <RaisedButton
                            id={'startExportBtnId'}
                            primary
                            label={i18n.t(i18nKeys.analytics.actionButton)}
                            onClick={this.initAnalyticsTablesGeneration}
                            disabled={this.areActionsDisabled()}
                        />
                    </CardText>
                </Card>
                {this.state.notifications.length > 0 &&
                    <Card className={styles.cardContainer}>
                        <CardText>
                            <NotificationsTable notifications={this.state.notifications} />
                        </CardText>
                    </Card>
                }
            </div>
        );
    }
}

export default Analytics;
