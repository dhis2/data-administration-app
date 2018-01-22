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

const AppRouter = ({ notifySidebar }) => {
    const routes = sections.map((section) => {
        const routeRender = () => {
            const Component = translate()(section.component);
            return (
                <Component
                    notifySidebar={notifySidebar}
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
        <main>
            <Switch>
                {routes}
            </Switch>
        </main>
    );
};

AppRouter.propTypes = {
    notifySidebar: PropTypes.func.isRequired,
};

export default AppRouter;
