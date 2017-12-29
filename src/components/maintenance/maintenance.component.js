import React, { Component } from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import {orange500} from 'material-ui/styles/colors';

// App configs
import { maintenanceCheckboxes } from '../../configs/maintenance.conf';

import './maintenance.css';

class MaintenanceComponent extends Component {
  constructor() {
    super();

    let checkboxes = {};
    for (let checkbox of maintenanceCheckboxes) {
      checkboxes[checkbox.key] = { checked: false };
    }

    this.state = {
      checkAll: false,
      checkboxes: checkboxes
    }
  }

  toggleCheckAll() {
    const checked = !this.state.checkAll;

    let checkboxes = {};
    for (let key in this.state.checkboxes) {
      checkboxes[key] = { checked: checked };
    }

    this.setState({
      checkAll: checked,
      checkboxes: checkboxes
    });
  }

  performMaintenance() {
    for (let key in this.state.checkboxes) {
      console.log(`${key} -  ${this.state.checkboxes[key].checked}`);
    }


    // TODO request to server
    // TODO loader
  }

  render() {
    const t = this.props.t;
    let checkboxes = this.state.checkboxes;
    const gridElements = maintenanceCheckboxes.map((checkbox) => {
      const checkboxState = checkboxes[checkbox.key].checked;
      return (
        <GridTile key={checkbox.key}>
          <Checkbox
            label={t(checkbox.label)}
            checked={checkboxState}
            onCheck={(() => {
              checkboxes[checkbox.key].checked = !checkboxState;
              this.setState({checkboxes: checkboxes});
            })}/>
        </GridTile>
      );
    });

    return (
      <div>
        <h1>{t('Maintenance')}</h1>
        <Card>
            <CardText>
              <Checkbox className='maintenance-check-all'
                checked={this.state.checkAll}
                onCheck={this.toggleCheckAll.bind(this)}/>
              <GridList
                className='maintenance-grid-container'
                cellHeight='auto'
                cols={3}
                padding={16}>
                {gridElements}
              </GridList>
              <FlatButton
                className='maintenance-action-button'
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
