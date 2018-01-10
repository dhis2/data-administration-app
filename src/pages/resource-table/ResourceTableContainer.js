import React, { PureComponent } from 'react';

// Material UI
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import { orange500 } from 'material-ui/styles/colors';

// d2
import { getInstance } from 'd2/lib/d2';

import PropTypes from 'prop-types';

// App configs
import resourceTable from './resourceTable.conf';

import './ResourceTable.css';

class ResourceTableContainer extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        showSnackbar: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.generateTables = this.generateTables.bind(this);
    }

    generateTables() {
        const showSnackbar = this.props.showSnackbar;
        const t = this.props.t;

        getInstance().then((d2) => {
            const api = d2.Api.getApi();
            api.get('system/tasks/RESOURCETABLE_UPDATE').then(() => {
                showSnackbar(t('Resource tables generated'));
            }).catch(() => {
                showSnackbar(t('Not possible to generate resource tables'));
            });
        });
    }

    render() {
        const t = this.props.t;
        const gridElements = resourceTable.map(resource => (
            <GridTile key={resource.key}>
                <span className="resource-table-grid-title">{resource.label}</span>
                <span className="resource-table-grid-sub-title">{resource.description}</span>
            </GridTile>
        ));
        return (
            <div>
                <GridList
                    className="resource-table-grid-container"
                    cellHeight="auto"
                    cols={3}
                    padding={16}
                >
                    {gridElements}
                </GridList>
                <FlatButton
                    className="resource-table-action-button"
                    backgroundColor={orange500}
                    label={t('GENERATE TABLES')}
                    onClick={this.generateTables}
                />
            </div>
        );
    }
}

export default ResourceTableContainer;
