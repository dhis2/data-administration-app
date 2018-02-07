// React
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, withRouter } from 'react-router-dom';

// D2
import { getManifest, getUserSettings } from 'd2/lib/d2';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

// logging
import log from 'loglevel';

// Internatinalization: i18next
import { I18nextProvider, translate } from 'react-i18next';
import i18n from './i18n';

import './index.css';
import App from './App';
import appTheme from './theme';

import registerServiceWorker from './registerServiceWorker';

const AppComponent = withRouter(translate()(App));

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.DEBUG);

const configLocale = (userSettings) => {
    const uiLocale = userSettings.keyUiLocale;
    if (uiLocale && uiLocale !== 'en') {
        i18n.changeLanguage(uiLocale);
    }
};

// init d2
getManifest('manifest.webapp').then((manifest) => {
    const api = process.env.REACT_APP_DHIS2_API_VERSION ? `/${process.env.REACT_APP_DHIS2_API_VERSION}` : '/';
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? `${manifest.getBaseUrl()}/api/29`
            : `${process.env.REACT_APP_DHIS2_BASE_URL}/api${api}`;

    ReactDOM.render(
        <D2UIApp
            muiTheme={appTheme}
            initConfig={{
                baseUrl,
                schemas: [
                    'organisationUnit',
                    'dataSet',
                ],
            }}
        >
            <I18nextProvider i18n={i18n}>
                <HashRouter>
                    <AppComponent />
                </HashRouter>
            </I18nextProvider>
        </D2UIApp>,
        document.getElementById('app'),
    );
}).then(getUserSettings).then(configLocale);

registerServiceWorker();
