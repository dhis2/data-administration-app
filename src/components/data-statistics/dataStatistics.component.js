import React, { Component } from 'react';

// React i18next
import { translate } from 'react-i18next';

// Material UI
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './dataStatistics.css';

class DataStatisticsComponent extends Component {
  constructor() {
    super();

    this.state = {
      tables: []
    };
  }

  componentWillMount() {
    // TODO request statistics to backend
    const tables = [
      {
        label: 'Object type',
        elements: [
          {label: 'Data elements', count: 894},
          {label: 'Data element groups', count: 83}
        ]
      },
      {
        label: 'Users logged in',
        elements: [
          {label: 'Last hour', count: 0},
          {label: 'Today', count: 1},
          {label: 'Last 2 days', count: 3},
          {label: 'Last 7 days', count: 1},
          {label: 'Last 30 days', count: 5}
        ]
      }
    ];

    this.setState({tables: tables});
  }

  render() {
    const t = this.props.t;
    const tables = this.state.tables.map((table) => {
      const rows = table.elements.map((element) => {
        return(
          <TableRow key={element.label}>
            <TableRowColumn>{element.label}</TableRowColumn>
            <TableRowColumn>{element.count}</TableRowColumn>
          </TableRow>
        );
      });
      return(
        <div key={table.label} className='statistics-table'>
          <Table selectable={false}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}>
              <TableRow>
                <TableHeaderColumn>{table.label}</TableHeaderColumn>
                <TableHeaderColumn>{t('Number')}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              stripedRows={false}>
              {rows}
            </TableBody>
          </Table>
        </div>
      );
    });

    return (
      <div>
        <h1>{ t('Data Statistics') }</h1>
        {tables}
    </div>
    );
  }
}

export default translate()(DataStatisticsComponent);
