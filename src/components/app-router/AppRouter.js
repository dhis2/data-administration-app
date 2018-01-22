import React from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-i18next';

import { Route, Switch } from 'react-router-dom';

// App configs
import { sections } from '../../pages/sections.conf';

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for <code>{location.pathname}</code></h3>
    </div>
);

NoMatch.propTypes = {
    location: PropTypes.object.isRequired,
};

export default class AppRouter extends React.Component {
    static propTypes = {
        toggleLoading: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    toggleLoading() {
        this.props.toggleLoading();
    }

    render() {
        const routes = sections.map((section) => {
            const routeRender = () => {
                const Component = translate()(section.component);
                const toggleLoading = () => {
                    this.toggleLoading();
                };
                return (
                    <Component
                        pageInfo={section.info}
                        toggleLoading={toggleLoading}
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
            <main>
                <Switch>
                    {routes}
                </Switch>
            </main>
        );
    }
}
