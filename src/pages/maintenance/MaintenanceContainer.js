import React, { Component } from 'react';

// Material UI
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

class MaintenanceContainer extends Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
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

        if (oneOptionChecked) {
            getInstance().then((d2) => {
                const api = d2.Api.getApi();
                api.post('maintenance', formData).then(() => {

                }).catch(() => {

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
                <GridTile key={checkbox.key} className="maintenance-option">
                    <Checkbox
                        className="maintenance-checkbox"
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
            </div>
        );
    }
}

export default MaintenanceContainer;
