import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, List, ListItem } from 'material-ui';
import { Link } from 'react-router-dom';

import styles from './SidebarMenu.css';

class SidebarMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentSection: this.props.sections[0].key,
        };
    }

    render() {
        const menu = (
            <List className={styles.list}>
                {
                    this.props.sections.map((section) => {
                        const listItemStyle = section.key === this.state.currentSection
                            ? styles.activeItem
                            : styles.item;
                        const icon = typeof section.info.icon === 'string' || section.info.icon instanceof String
                            ? <FontIcon className="material-icons">{section.info.icon}</FontIcon>
                            : section.info.icon;
                        const handleMenuClick = () => {
                            this.setState({ currentSection: section.key });
                        };

                        return (
                            <Link key={section.key} className={styles.itemLink} to={section.path}>
                                <ListItem
                                    key={section.key}
                                    className={listItemStyle}
                                    leftIcon={icon}
                                    onClick={handleMenuClick}
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
