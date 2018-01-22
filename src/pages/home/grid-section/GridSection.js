import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI
import { GridTile } from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';

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
                    <div className={styles.gridTitleBar}>
                        <span className={styles.gridTitleDescription}>{this.props.section.info.label}</span>
                        <FontIcon
                            className={classNames('material-icons', styles.gridIcon)}
                        >
                            {this.props.section.info.icon}
                        </FontIcon>
                    </div>
                    <span className={styles.gridDescription}>{t(this.props.section.info.description)}</span>
                    <span className={styles.gridActionText}>{t(this.props.section.info.actionText)}</span>
                </GridTile>
            </Link>
        );
    }
}

export default GridSection;
