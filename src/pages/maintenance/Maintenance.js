import React from 'react';
import { GridTile } from 'material-ui/GridList';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import classNames from 'classnames';
import { LOADING, SUCCESS, ERROR } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';
import Page from '../Page';
import {
    maintenanceCheckboxes,
    PAGE_TITLE,
    MAINTENANCE_ENDPOINT,
} from './maintenance.conf';
import { getDocsKeyForSection } from '../sections.conf';
import PageHelper from '../../components/page-helper/PageHelper';
import styles from '../Page.module.css';

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

        this.state = {
            intervalId: null,
            checkboxes,
            loading: false,
        };

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
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.maintenance.performing),
            },
            pageState: {
                loading: true,
            },
        });
    }

    setLoadedPageWithErrorState(error) {
        const messageError = error && error.message ?
            error.message :
            i18n.t(i18nKeys.maintenance.unexpectedError);
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
                            message: i18n.t(i18nKeys.maintenance.actionPerformed),
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
                    className={classNames('col-xs-12 col-md-6 col-lg-4', styles.formControl)}
                >
                    <Checkbox
                        label={i18n.t(checkbox.label)}
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
                    {i18n.t(PAGE_TITLE)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card id={'maintenanceContentContainerId'}>
                    <CardText>
                        <div className={classNames(styles.gridContainer, 'row')}>
                            {gridElements}
                        </div>
                        <RaisedButton
                            id={'performMaintenanceBtnId'}
                            label={i18n.t(i18nKeys.maintenance.actionButton)}
                            onClick={this.performMaintenance}
                            primary
                            disabled={this.areActionsDisabled() || this.selectedCheckboxesCount() === 0}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default Maintenance;
