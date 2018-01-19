import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI
import { GridTile } from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import { blue500 } from 'material-ui/styles/colors';

import classNames from 'classnames';

import styles from './GridSection.css';

class GridSection extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        section: PropTypes.object.isRequired,
    }

    render() {
        const t = this.props.t;
        return (
            <Link className="link" to={this.props.section.path}>
                <GridTile key={this.props.section.key} className={styles.gridElement}>
                    <FontIcon
                        className={classNames('material-icons', styles.gridIcon)}
                        color={blue500}
                    >
                        {this.props.section.info.icon}
                    </FontIcon>
                    <div className={styles.gridDescription}>{t(this.props.section.info.description)}</div>
                    <div className={styles.gridTitle}>{t(this.props.section.info.label)}</div>
                </GridTile>
            </Link>
        );
    }
}

export default GridSection;
