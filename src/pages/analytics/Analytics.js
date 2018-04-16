import React from 'react';

/* Material UI */
import { GridTile } from 'material-ui/GridList';
import { Card, CardText } from 'material-ui/Card';
import { RaisedButton } from 'material-ui';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import classNames from 'classnames';

import { ERROR, LOADING } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';
import {
    PULL_INTERVAL,
    ANALYTICS_TABLES_ENDPOINT,
    ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT,
    analyticsCheckboxes,
    lastYearElements,
    DEFAULT_LAST_YEARS,
    LAST_YEARS_INPUT_KEY,
} from '../analytics/analytics.conf';

// i18n
import { i18nKeys } from '../../i18n';

import styles from '../Page.css';

class Analytics extends Page {
    static STATE_PROPERTIES = [
        'checkboxes',
        'loading',
        'lastYears',
    ];

    constructor() {
        super();

        const checkboxes = {};
        for (let i = 0; i < analyticsCheckboxes.length; i++) {
            const checkbox = analyticsCheckboxes[i];
            checkboxes[checkbox.key] = { checked: false };
        }

        this.state = {
            intervalId: null,
            checkboxes,
            loading: false,
            lastYears: DEFAULT_LAST_YEARS,
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
        // const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        const url = `${ANALYTIC_TABLES_TASK_SUMMARY_ENDPOINT}`;
        api.get(url).then((response) => {
            if (this.isPageMounted() && response) {
                for (let i = 0; i < response.length; i++) {
                    const notification = response[i];
                    if (notification.completed) {
                        this.cancelPullingRequests();
                        /*
                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: SUCCESS,
                                message: translator(i18nKeys.analytics.actionPerformed),
                            },
                            pageState: {
                                loading: false,
                            },
                        });
                        break;
                        */
                    }
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

    render() {
        const translator = this.context.translator;
        const checkboxes = Object.assign({}, this.state.checkboxes);
        const gridElements = analyticsCheckboxes.map((checkbox) => {
            const checkboxState = checkboxes[checkbox.key].checked;
            const toggleCheckbox = (() => {
                checkboxes[checkbox.key].checked = !checkboxState;
                this.setState({ checkboxes });
            });
            return (
                <GridTile
                    key={checkbox.key}
                    className={classNames('col-xs-12 col-md-6', styles.formControl)}
                >
                    <Checkbox
                        label={translator(checkbox.label)}
                        checked={checkboxState}
                        onCheck={toggleCheckbox}
                        labelStyle={{ color: '#000000' }}
                        iconStyle={{ fill: '#000000' }}
                        disabled={this.areActionsDisabled()}
                    />
                </GridTile>
            );
        });
        return (
            <div>
                <h1>
                    { translator(i18nKeys.analytics.title) }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card>
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
            </div>
        );
    }
}

export default Analytics;
