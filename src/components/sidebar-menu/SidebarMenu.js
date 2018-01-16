import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, List, ListItem } from 'material-ui';
import { Link } from 'react-router-dom';

const styles = {
    container: {
        padding: '16px 32px 0 24px',
        position: 'relative',
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        cursor: 'pointer',
        top: '2rem',
        right: '.75rem',
        fontSize: '1rem',
        color: '#AAA',
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: 'transparent',
        marginTop: 16,
    },
    item: {
        fontSize: 14,
        borderRadius: 5,
        margin: '0 8px',
    },
    itemLink: {
        textDecoration: 'none',
        margin: 0,
    },
    activeItem: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2196f3',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        margin: '0 8px',
    },
    sidebar: {
        backgroundColor: '#f3f3f3',
        overflowY: 'auto',
        width: 295,
    },
};

class SidebarMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentSection: this.props.sections[0].key,
        };
    }

    setSection(sectionKey) {
        this.setState({ currentSection: sectionKey });
    }

    render() {
        const menu = (
            <List style={styles.list}>
                {
                    this.props.sections.map((section) => {
                        const listItemStyle = section.key === this.state.currentSection
                            ? styles.activeItem
                            : styles.item;
                        const icon = typeof section.info.icon === 'string' || section.info.icon instanceof String
                            ? <FontIcon className="material-icons">{section.info.icon}</FontIcon>
                            : section.info.icon;

                        return (
                            <Link key={section.key} style={styles.itemLink} to={section.path}>
                                <ListItem key={section.key} style={listItemStyle} leftIcon={icon} onClick={this.setSection.bind(this, section.key)}>
                                    {section.label}
                                </ListItem>
                            </Link>
                        );
                    })
                }
            </List>);
        return (
            <div style={Object.assign(styles.sidebar)} className="left-bar">
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
