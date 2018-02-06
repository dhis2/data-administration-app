import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { Card, CardText } from 'material-ui/Card';

import Page from '../Page';

// App configs
import { maintenanceCheckboxes, RESOURCE_TABLES_OPTION_KEY } from './maintenance.conf';

import styles from './Maintenance.css';

class Maintenance extends Page {
    static propTypes = {
        pageInfo: PropTypes.object.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
        loading: PropTypes.bool,
        currentSection: PropTypes.string,
        pageState: PropTypes.object,
        t: PropTypes.func,
        updateAppState: PropTypes.func,
    };

    constructor(props, context) {
        super(props);

        this.state = context && context.pageState ? { ...context.pageState } : {};

        // state defaults
        if (!this.state.hasOwnProperty('checkboxes')) {
            const checkboxes = {};
            for (let i = 0; i < maintenanceCheckboxes.length; i++) {
                const checkbox = maintenanceCheckboxes[i];
                checkboxes[checkbox.key] = { checked: false };
            }
            this.state.checkboxes = checkboxes;
        }

        if (!this.state.hasOwnProperty('checkAll')) {
            this.state.checkAll = false;
        }

        // actions
        this.performMaintenance = this.performMaintenance.bind(this);
        this.toggleCheckAll = this.toggleCheckAll.bind(this);
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

    toggleCheckAll() {
        const checked = !this.state.checkAll;

        const checkboxes = {};
        const checkboxKeys = Object.keys(this.state.checkboxes);
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            checkboxes[key] = { checked };
        }

        this.setState({
            checkAll: checked,
            checkboxes,
        });
    }

    performMaintenance() {
        const formData = this.buildFormData();
        const api = this.context.d2.Api.getApi();
        const apiRequests = [];
        if (formData) {
            apiRequests.push(api.post('maintenance', formData));
        }

        // resource table option is checked. It is treated differently
        if (this.state.checkboxes[RESOURCE_TABLES_OPTION_KEY].checked) {
            apiRequests.push(api.post('resourceTables'));
        }

        if (apiRequests.length > 0) {
            this.context.updateAppState({
                loading: true,
                pageState: {
                    checkboxes: this.state.checkboxes,
                    checkAll: this.state.checkAll,
                },
            });

            Promise.all(apiRequests).then(() => {
                this.context.updateAppState({
                    loading: false,
                    pageState: {
                        checkboxes: this.state.checkboxes,
                        checkAll: this.state.checkAll,
                    },
                });
            }).catch(() => {
                this.context.updateAppState({
                    loading: false,
                    pageState: {
                        checkboxes: this.state.checkboxes,
                        checkAll: this.state.checkAll,
                    },
                });
            });
        }
    }

    render() {
        const t = this.context.t;
        const checkboxes = this.state.checkboxes;
        const gridElements = maintenanceCheckboxes.map((checkbox) => {
            const checkboxState = checkboxes[checkbox.key].checked;
            const toggleCheckbox = (() => {
                checkboxes[checkbox.key].checked = !checkboxState;
                this.setState({ checkboxes });
            });
            return (
                <GridTile key={checkbox.key}>
                    <Checkbox
                        label={t(checkbox.label)}
                        checked={checkboxState}
                        onCheck={toggleCheckbox}
                        labelStyle={{ color: '#000000' }}
                        iconStyle={{ fill: '#000000' }}
                    />
                </GridTile>
            );
        });

        return (
            <div className="page-wrapper">
                <h1>{this.context.t(this.props.pageInfo.label)}</h1>
                <Card>
                    <CardText>
                        <Checkbox
                            id="maintenance-check-all"
                            className={styles.maintenanceCheckAll}
                            label={t('Select all')}
                            checked={this.state.checkAll}
                            onCheck={this.toggleCheckAll}
                            labelStyle={{ color: '#757575' }}
                            iconStyle={{ fill: '#757575' }}
                        />
                        <GridList
                            className={styles.maintenanceGridContainer}
                            cellHeight="auto"
                            cols={3}
                            padding={16}
                        >
                            {gridElements}
                        </GridList>
                        <FlatButton
                            className={styles.maintenanceActionButton}
                            backgroundColor="#004ba0"
                            label={t('PERFORM MAINTENANCE')}
                            onClick={this.performMaintenance}
                            primary="true"
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default Maintenance;
