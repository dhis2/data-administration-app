import React, { PureComponent } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FontIcon, List, ListItem } from 'material-ui';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import styles from './App.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from './pages/sections.conf';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for <code>{location.pathname}</code></h3>
    </div>
);

NoMatch.propTypes = {
    location: PropTypes.object.isRequired,
};

class App extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            currentSection: HOME_SECTION_KEY,
        };

        this.handleSelectedMenu = this.handleSelectedMenu.bind(this);
    }

    handleSelectedMenu(sectionKey) {
        this.setState({ currentSection: sectionKey });
    }

    render() {
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                label: this.props.t(section.info.label),
            },
        ));

        const menu = (
            <List className={styles.list}>
                {
                    translatedSections.map((section) => {
                        const listItemStyle = section.key === this.state.currentSection
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

        const routes = sections.map((section) => {
            const routeRender = () => {
                const Component = translate()(section.component);
                return (
                    <Component
                        notifiySidebar={this.handleSelectedMenu}
                        pageInfo={section.info}
                        sectionKey={section.key}
                    />
                );
            };
            return (
                <Route
                    key={section.key}
                    exact
                    path={section.path}
                    render={routeRender}
                />
            );
        });
        routes.push(<Route key="no-match-route" component={NoMatch} />);

        return (
            <div className={styles.container}>
                <HeaderBar />
                <div className={classNames(styles.sidebar, styles.leftBar)}>
                    {menu}
                </div>
                <main className={styles.contentArea}>
                    <Switch>
                        {routes}
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;
