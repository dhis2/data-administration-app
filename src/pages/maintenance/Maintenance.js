import React from 'react';

// Material UI
import { GridTile } from 'material-ui/GridList';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import { LOADING, SUCCESS, ERROR } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import classNames from 'classnames';

import Page from '../Page';

// App configs
import {
    maintenanceCheckboxes,
    PAGE_TITLE,
    MAINTENANCE_ENDPOINT,
} from './maintenance.conf';
import { getDocsKeyForSection } from '../sections.conf';

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
            intervalId: null,
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

    setLoadingPageState() {
        const translator = this.context.translator;
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator('Performing Maintenance...'),
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
            translator('An unexpected error happened during maintenance');
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
            formData = formData || new FormData();
            formData.append(key, checked);
        }

        return formData;
    }

    performMaintenance() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        const formData = this.buildFormData();

        if (formData) {
            this.setLoadingPageState();
            api.post(MAINTENANCE_ENDPOINT, formData).then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: translator('Maintenance done'),
                        },
                        pageState: {
                            loading: false,
                        },
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    this.setLoadedPageWithErrorState(error);
                }
            });
        }
    }

    render() {
        const translator = this.context.translator;
        const checkboxes = Object.assign({}, this.state.checkboxes);
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
            <div>
                <h1 className={styles.header}>
                    {translator(PAGE_TITLE)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
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
