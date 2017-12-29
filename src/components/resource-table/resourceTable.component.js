import React, { Component } from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import {orange500} from 'material-ui/styles/colors';

// App configs
import { resourceTable } from '../../configs/resourceTable.conf';

import './resourceTable.css';

class ResourceTableComponent extends Component {
  generateTables() {
    // TODO
  }

  render() {
    const t = this.props.t;
    const gridElements = resourceTable.map((resource) => {
      return (
        <GridTile key={resource.key}>
          <span className="resource-table-grid-title">{resource.label}</span>
          <span className="resource-table-grid-sub-title">{resource.description}</span>
        </GridTile>
      );
    });
    return (
      <div>
        <h1>{t('Resource Table')}</h1>
        <Card>
            <CardText>
              <GridList
                className='resource-table-grid-container'
                cellHeight='auto'
                cols={3}
                padding={16}>
                {gridElements}
              </GridList>
              <FlatButton
                className='resource-table-action-button'
                backgroundColor={orange500}
                label={t('GENERATE TABLES')}
                onClick={this.generateTables.bind(this)}
              />
            </CardText>
        </Card>
    </div>
    );
  }
}

export default ResourceTableComponent;
