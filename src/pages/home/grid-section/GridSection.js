import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI
import { GridTile } from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';

import classNames from 'classnames';

/* i18n */
import i18n from '../../../locales';

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

    render() {
        return (
            <Link to={this.props.section.path}>
                <GridTile key={this.props.section.key} className={classNames('section', styles.gridElement)}>
                    <div className={classNames('row', styles.gridTitleBar)}>
                        <span className={classNames('section-title', styles.gridTitleDescription)}>
                            {this.props.section.info.label}
                        </span>
                        <FontIcon
                            className={classNames('material-icons', 'icon', styles.gridIcon)}
                        >
                            {this.props.section.info.icon}
                        </FontIcon>
                    </div>
                    <span className={classNames('section-description', 'row', styles.gridDescription)}>
                        {i18n.t(this.props.section.info.description)}
                    </span>
                    <span className={classNames('section-action-text', 'row', styles.gridActionText)}>
                        {i18n.t(this.props.section.info.actionText)}
                    </span>
                </GridTile>
            </Link>
        );
    }
}

export default GridSection;
