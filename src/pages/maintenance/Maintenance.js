import React from 'react';

// Material UI
import { GridTile } from 'material-ui/GridList';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import classNames from 'classnames';

import Page from '../Page';

// App configs
import { maintenanceCheckboxes, RESOURCE_TABLES_OPTION_KEY, PAGE_SUMMARY, PAGE_TITLE } from './maintenance.conf';
import { LOADING, SUCCESS, ERROR } from '../../components/feedback-snackbar/FeedbackSnackbarTypes';

import styles from './Maintenance.css';
import PageHelper from '../../components/page-helper/PageHelper';

class Maintenance extends Page {
    static STATE_PROPERTIES = [
        'checkboxes',
        'loading',
    ]

    constructor() {
        super();

        const checkboxes = {};
        for (let i = 0; i < maintenanceCheckboxes.length; i++) {
            const checkbox = maintenanceCheckboxes[i];
            checkboxes[checkbox.key] = { checked: false };
        }

        // state defaults
        this.state = {
            checkboxes,
            loading: false,
        };

        // actions
        this.performMaintenance = this.performMaintenance.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && Maintenance.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    selectedCheckboxesCount() {
        let selectedCheckboxes = 0;
        const checkboxKeys = Object.keys(this.state.checkboxes);
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            const checked = this.state.checkboxes[key].checked;
            if (checked) {
                selectedCheckboxes += 1;
            }
        }
        return selectedCheckboxes;
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
            if (key !== RESOURCE_TABLES_OPTION_KEY && checked) {
                formData = formData || new FormData();
                formData.append(key, checked);
            }
        }

        return formData;
    }

    performMaintenance() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();

        const apiRequests = [];
        const formData = this.buildFormData();
        if (formData) {
            apiRequests.push(api.post('maintenance', formData));
        }

        // resource table option is checked. It is treated differently
        if (this.state.checkboxes[RESOURCE_TABLES_OPTION_KEY].checked) {
            apiRequests.push(api.post('resourceTables'));
        }

        if (apiRequests.length > 0) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                    message: translator('Performing Maintenance...'),
                },
                pageState: {
                    checkboxes: this.state.checkboxes,
                    loading: true,
                },
            });

            Promise.all(apiRequests).then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: translator('Maintenance done'),
                        },
                        pageState: {
                            checkboxes: this.state.checkboxes,
                            loading: false,
                        },
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        translator('An unexpected error happend during maintenance');

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            checkboxes: this.state.checkboxes,
                            loading: false,
                        },
                    });
                }
            });
        }
    }

    render() {
        const translator = this.context.translator;
        const checkboxes = this.state.checkboxes;
        const gridElements = maintenanceCheckboxes.map((checkbox) => {
            const checkboxState = checkboxes[checkbox.key].checked;
            const toggleCheckbox = (() => {
                checkboxes[checkbox.key].checked = !checkboxState;
                this.setState({ checkboxes });
            });
            return (
                <GridTile
                    key={checkbox.key}
                    className={classNames('col-xs-12 col-md-6 col-lg-4', styles.maintenanceControl)}
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
            <div className="page-wrapper">
                <h1 className={styles.header}>
                    {translator(PAGE_TITLE)}
                    <PageHelper
                        pageTitle={PAGE_TITLE}
                        pageSummary={PAGE_SUMMARY}
                        pageAreas={maintenanceCheckboxes}
                    />
                </h1>
                <Card>
                    <CardText>
                        <div className={classNames(styles.maintenanceGridContainer, 'row')}>
                            {gridElements}
                        </div>
                        <RaisedButton
                            label={translator('PERFORM MAINTENANCE')}
                            onClick={this.performMaintenance}
                            primary={Boolean(true)}
                            disabled={this.areActionsDisabled() || this.selectedCheckboxesCount() === 0}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default Maintenance;
