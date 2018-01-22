import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, List, ListItem } from 'material-ui';
import { Link } from 'react-router-dom';

import styles from './SidebarMenu.css';

class SidebarMenu extends PureComponent {
    render() {
        const menu = (
            <List className={styles.list}>
                {
                    this.props.sections.map((section) => {
                        const listItemStyle = section.key === this.props.currentSection
                            ? styles.activeItem
                            : styles.item;
                        const icon = typeof section.info.icon === 'string' || section.info.icon instanceof String
                            ? <FontIcon className="material-icons">{section.info.icon}</FontIcon>
                            : section.info.icon;

                        return (
                            <Link key={section.key} className={styles.itemLink} to={section.path}>
                                <ListItem
                                    key={section.key}
                                    className={listItemStyle}
                                    leftIcon={icon}
                                >
                                    {section.label}
                                </ListItem>
                            </Link>
                        );
                    })
                }
            </List>);
        return (
            <div style={Object.assign(styles.sidebar)} className={styles.leftBar}>
                {menu}
            </div>
        );
    }
}

SidebarMenu.propTypes = {
    currentSection: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string,
        info: PropTypes.shape({
            label: PropTypes.string,
            description: PropTypes.string,
            icon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.element,
            ]),
        }),
    })).isRequired,
};

export default SidebarMenu;
