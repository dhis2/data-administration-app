import React from 'react';
import { translate } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    constructor(props) {
        super(props);
        this.handleUpdateSelectedMenu = this.handleUpdateSelectedMenu.bind(this);
        this.showSnackbar = this.showSnackbar.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    handleUpdateSelectedMenu(sectionKey) {
        this.props.updateSelectedMenu(sectionKey);
    }

    closeSnackbar() {
        this.setState({ snackbar: undefined });
    }

    showSnackbar(message) {
        this.setState({ snackbar: message });
    }

    render() {
        const routes = sections.map(section => (
            <Route
                key={section.key}
                exact
                path={section.path}
                render={() => {
                    const Component = translate()(section.component);
                    return (
                        <Component
                            pageInfo={section.info}
                            showSnackbar={this.showSnackbar}
                        />
                    );
                }}
            />));
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
AppRouter.propTypes = {
    updateSelectedMenu: PropTypes.func.isRequired,
};
