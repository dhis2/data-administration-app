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

const AppRouter = ({ updateAppState, appState }) => {
    const routes = sections.map((section) => {
        const routeRender = () => {
            const Page = translate()(section.component);
            return (
                <Page
                    updateAppState={updateAppState}
                    pageInfo={section.info}
                    sectionKey={section.key}
                    {...appState}
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
};

AppRouter.propTypes = {
    updateAppState: PropTypes.func.isRequired,
    appState: PropTypes.object.isRequired,
};

export default AppRouter;
