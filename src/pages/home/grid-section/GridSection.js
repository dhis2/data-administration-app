import classNames from 'classnames'
import FontIcon from 'material-ui/FontIcon'
import { GridTile } from 'material-ui/GridList'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import styles from './GridSection.module.css'

class GridSection extends PureComponent {
    static propTypes = {
        section: PropTypes.shape({
            info: PropTypes.shape({
                actionText: PropTypes.string,
                description: PropTypes.string,
                icon: PropTypes.string,
                label: PropTypes.string,
            }),
            key: PropTypes.string,
            path: PropTypes.string,
        }).isRequired,
    }

    render() {
        return (
            <Link to={this.props.section.path}>
                <GridTile
                    key={this.props.section.key}
                    className={classNames('section', styles.gridElement)}
                >
                    <div className={classNames('row', styles.gridTitleBar)}>
                        <span
                            className={classNames(
                                'section-title',
                                styles.gridTitleDescription
                            )}
                        >
                            {this.props.section.info.label}
                        </span>
                        <FontIcon
                            className={classNames(
                                'material-icons',
                                'icon',
                                styles.gridIcon
                            )}
                        >
                            {this.props.section.info.icon}
                        </FontIcon>
                    </div>
                    <span
                        className={classNames(
                            'section-description',
                            'row',
                            styles.gridDescription
                        )}
                    >
                        {this.props.section.info.description}
                    </span>
                    <span
                        className={classNames(
                            'section-action-text',
                            'row',
                            styles.gridActionText
                        )}
                    >
                        {this.props.section.info.actionText}
                    </span>
                </GridTile>
            </Link>
        )
    }
}

export default GridSection
