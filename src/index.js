import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { getUserSettings } from 'd2/lib/d2'
import D2UIApp from 'd2-ui/lib/app/D2UIApp'
import log from 'loglevel'
import { configI18n } from './configI18n'
import App from './App'
import appTheme from './theme'
import * as serviceWorker from './serviceWorker'
import './index.css'

import { Provider } from '@dhis2/app-runtime'
import { CssReset } from '@dhis2/ui-core'

const { NODE_ENV, REACT_APP_DHIS2_BASE_URL } = process.env
const isProduction = NODE_ENV === 'production'

/**
 * Configure logging
 */

log.setLevel(isProduction ? log.levels.INFO : log.levels.DEBUG)

/**
 * Render app
 */

const config = {
    baseUrl: REACT_APP_DHIS2_BASE_URL,
    apiVersion: '33',
}

ReactDOM.render(
    <Provider config={config}>
        <D2UIApp
            muiTheme={appTheme}
            initConfig={{
                baseUrl: `${REACT_APP_DHIS2_BASE_URL}/api`,
                schemas: [
                    'organisationUnitLevel',
                    'organisationUnitGroup',
                    'organisationUnit',
                    'dataSet',
                ],
            }}
        >
            <HashRouter>
                <CssReset />
                <App />
            </HashRouter>
        </D2UIApp>
    </Provider>,
    document.getElementById('root')
)

getUserSettings().then(userSettings => {
    const { keyUiLocale } = userSettings
    sessionStorage.setItem('uiLocale', keyUiLocale || 'en')

    configI18n(userSettings)
})

/**
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */

serviceWorker.register()
