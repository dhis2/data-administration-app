import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { orange500 } from 'material-ui/styles/colors';

// App configs
import { maintenanceCheckboxes, RESOURCE_TABLES_OPTION_KEY } from './maintenance.conf';

import styles from './Maintenance.css';

class MaintenanceContainer extends Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        updateAppState: PropTypes.func.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = props ? { ...props } : {};

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
            apiRequests.push(api.update('resourceTables'));
        }

        if (apiRequests.length > 0) {
            this.props.updateAppState({
                loading: true,
                pageState: {
                    checkboxes: this.state.checkboxes,
                    checkAll: this.state.checkAll,
                },
            });

            Promise.all(apiRequests).then(() => {
                this.props.updateAppState({
                    loading: false,
                    pageState: {
                        checkboxes: this.state.checkboxes,
                        checkAll: this.state.checkAll,
                    },
                });
            }).catch(() => {
                this.props.updateAppState({
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
        const t = this.props.t;
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
                    />
                </GridTile>
            );
        });

        return (
            <div>
                <Checkbox
                    id="maintenance-check-all"
                    className={styles.maintenanceCheckAll}
                    checked={this.state.checkAll}
                    onCheck={this.toggleCheckAll}
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
                    backgroundColor={orange500}
                    label={t('PERFORM MAINTENANCE')}
                    onClick={this.performMaintenance}
                />
            </div>
        );
    }
}

export default MaintenanceContainer;
