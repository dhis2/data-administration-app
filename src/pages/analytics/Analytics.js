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
import NotificationsTable from './NotificationsTable';
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
import { i18nKeys } from '../../i18n';

/* styles */
import styles from '../Page.css';

class Analytics extends Page {
    static STATE_PROPERTIES = [
        'checkboxes',
        'loading',
        'lastYears',
        'notifications',
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
            translator(i18nKeys.analytics.unexpectedError);
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

    initAnalyticsTablesGeneration() {
        const api = this.context.d2.Api.getApi();
        const formData = this.buildFormData();

        this.setLoadingPageState();
        api.post(ANALYTICS_TABLES_ENDPOINT, formData).then((response) => {
            if (this.isPageMounted() && response) {
                const jobId = response[0].id;
                const intervalId = setInterval(() => {
                    this.requestTaskSummary();
                }, PULL_INTERVAL);

                this.setState({
                    jobId,
                    intervalId,
                    notifications: [],
                });
            }
        }).catch((e) => {
            if (this.isPageMounted()) {
                this.setLoadedPageWithErrorState(e);
            }
        });
    }

    requestTaskSummary() {
        const api = this.context.d2.Api.getApi();
        const lastId = this.state.notifications && this.state.notifications.length > 0
            ? this.state.notifications[0].uid : null;
        const url = lastId ?
            `${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}?lastId=${lastId}` : `${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}`;
        api.get(url).then((response) => {
            if (this.isPageMounted() && response) {
                let completed = false;
                const currentNotifications = [...this.state.notifications];
                // FIXME waiting for REST API fixes: response sending multiple root elements. Use this.state.jobId
                const notificationResponses = response[Object.keys(response)[0]] || response || [];

                notificationResponses.forEach((notification) => {
                    currentNotifications.push(notification);
                    if (notification.completed) {
                        completed = true;
                    }
                });

                if (completed) {
                    this.cancelPullingRequests();
                    this.context.updateAppState({
                        showSnackbar: false,
                        pageState: {
                            notifications: currentNotifications,
                            loading: false,
                        },
                    });
                } else {
                    this.context.updateAppState({
                        pageState: {
                            notifications: currentNotifications,
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

    renderCheckbox = (checkbox) => {
        const translator = this.context.translator;
        return (
            <GridTile
                key={checkbox.key}
                className={classNames('col-xs-12 col-md-6', styles.formControl)}
            >
                <Checkbox
                    label={translator(checkbox.label)}
                    checked={this.state.checkboxes[checkbox.key].checked}
                    onCheck={this.toggleCheckbox(this.state.checkboxes, checkbox.key)}
                    labelStyle={{ color: '#000000' }}
                    iconStyle={{ fill: '#000000' }}
                    disabled={this.areActionsDisabled()}
                />
            </GridTile>
        );
    };

    render() {
        const translator = this.context.translator;
        const gridElements = analyticsCheckboxes.map(this.renderCheckbox);
        return (
            <div>
                <h1>
                    { translator(i18nKeys.analytics.title) }
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
                                className="col-xs-12 col-md-6"
                                floatingLabelText={
                                    translator(i18nKeys.analytics.lastYearsLabel)
                                }
                                onChange={this.onChangeLastYears}
                                value={this.state.lastYears}
                                fullWidth
                            >
                                {lastYearElements.map(item => (
                                    <MenuItem
                                        key={item.key}
                                        value={item.value}
                                        primaryText={translator(item.displayName)}
                                    />
                                ))}
                            </SelectField>
                        </div>
                        <RaisedButton
                            primary
                            label={translator(i18nKeys.analytics.actionButton)}
                            onClick={this.initAnalyticsTablesGeneration}
                            disabled={this.state.loading}
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
