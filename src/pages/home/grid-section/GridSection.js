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
        section: PropTypes.shape({
            key: PropTypes.string,
            path: PropTypes.string,
            info: PropTypes.shape({
                label: PropTypes.string,
                description: PropTypes.string,
                icon: PropTypes.string,
                actionText: PropTypes.string,
            }),
        }).isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
    }

    render() {
        const translator = this.context.translator;
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
                    <span className={styles.gridDescription}>{translator(this.props.section.info.description)}</span>
                    <span className={styles.gridActionText}>{translator(this.props.section.info.actionText)}</span>
                </GridTile>
            </Link>
        );
    }
}

export default GridSection;
