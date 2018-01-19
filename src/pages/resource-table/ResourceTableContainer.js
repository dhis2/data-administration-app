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

import styles from './ResourceTable.css';

class ResourceTableContainer extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.generateTables = this.generateTables.bind(this);
    }

    generateTables() {
        const t = this.props.t;
        getInstance().then((d2) => {
            const api = d2.Api.getApi();
            api.update('resourceTables').then(() => {
                // FIXME:
                // console.log(t('Resource Table Update Task'));
                t('Resource Table Update Task');
            }).catch(() => {
                // FIXME:
                // console.log(t('Resource Table Update Task Error'));
                t('Resource Table Update Task Error');
            });
        });
    }

    render() {
        const t = this.props.t;
        const gridElements = resourceTable.map(resource => (
            <GridTile key={resource.key}>
                <span className={styles.resourceTableTitle}>{resource.label}</span>
                <span className={styles.resourceTableSubTitle}>{resource.description}</span>
            </GridTile>
        ));
        return (
            <div>
                <GridList
                    className={styles.resourceTableGridContainer}
                    cellHeight="auto"
                    cols={3}
                    padding={16}
                >
                    {gridElements}
                </GridList>
                <FlatButton
                    className={styles.resourceTableActionButton}
                    backgroundColor={orange500}
                    label={t('GENERATE TABLES')}
                    onClick={this.generateTables}
                />
            </div>
        );
    }
}

export default ResourceTableContainer;
