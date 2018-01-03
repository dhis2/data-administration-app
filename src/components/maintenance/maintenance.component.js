import React, { Component } from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { orange500 } from 'material-ui/styles/colors';

import PropTypes from 'prop-types';

// App configs
import maintenanceCheckboxes from '../../configs/maintenance.conf';

import './maintenance.css';

class MaintenanceComponent extends Component {
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
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            console.log(`${key} -  ${this.state.checkboxes[key].checked}`);
        }

        // TODO request to server
        // TODO loader
    }

    render() {
        const t = this.props.t;
        const checkboxes = this.state.checkboxes;
        const gridElements = maintenanceCheckboxes.map((checkbox) => {
            const checkboxState = checkboxes[checkbox.key].checked;
            return (
                <GridTile key={checkbox.key}>
                    <Checkbox
                        label={t(checkbox.label)}
                        checked={checkboxState}
                        onCheck={(() => {
                            checkboxes[checkbox.key].checked = !checkboxState;
                            this.setState({ checkboxes });
                        })}
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
                            onCheck={this.toggleCheckAll.bind(this)}
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
                            onClick={this.performMaintenance.bind(this)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default MaintenanceComponent;
