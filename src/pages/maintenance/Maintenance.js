import React, { Component } from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { orange500 } from 'material-ui/styles/colors';

// d2
import { getInstance } from 'd2/lib/d2';

import PropTypes from 'prop-types';

// App configs
import maintenanceCheckboxes from './maintenance.conf';

import './Maintenance.css';

class MaintenanceComponent extends Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        showSnackbar: PropTypes.func.isRequired,
    }

    constructor() {
        super();

        const checkboxes = {};
        for (let i = 0; i < maintenanceCheckboxes.length; i++) {
            const checkbox = maintenanceCheckboxes[i];
            checkboxes[checkbox.key] = { checked: false };
        }

        this.state = {
            checkAll: false,
            checkboxes,
        };

        this.performMaintenance = this.performMaintenance.bind(this);
        this.toggleCheckAll = this.toggleCheckAll.bind(this);
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
        const checkboxKeys = Object.keys(this.state.checkboxes);
        const formData = new FormData();
        let oneOptionChecked = false;
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            formData.append(key, this.state.checkboxes[key].checked);
            if (!oneOptionChecked && this.state.checkboxes[key].checked) {
                oneOptionChecked = true;
            }
        }

        const showSnackbar = this.props.showSnackbar;
        const t = this.props.t;

        if (oneOptionChecked) {
            getInstance().then((d2) => {
                showSnackbar(t('Starting maintenance'));
                const api = d2.Api.getApi();
                api.post('maintenance', formData).then(() => {
                    showSnackbar(t('Maintenance was performed'));
                    // console.log('request succeeded with data response status: ' + JSON.stringify(response, null, 2));
                }).catch(() => {
                    showSnackbar(t('Not possible to perform maintenance'));
                });
            });
        } else {
            showSnackbar(t('Please select at least one option'));
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
                <h1>{t('Maintenance')}</h1>
                <Card>
                    <CardText>
                        <Checkbox
                            className="maintenance-check-all"
                            checked={this.state.checkAll}
                            onCheck={this.toggleCheckAll}
                        />
                        <GridList
                            className="maintenance-grid-container"
                            cellHeight="auto"
                            cols={3}
                            padding={16}
                        >
                            {gridElements}
                        </GridList>
                        <FlatButton
                            className="maintenance-action-button"
                            backgroundColor={orange500}
                            label={t('PERFORM MAINTENANCE')}
                            onClick={this.performMaintenance}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default MaintenanceComponent;
