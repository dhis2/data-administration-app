import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { getUserSettings } from 'd2/lib/d2'
import D2UIApp from 'd2-ui/lib/app/D2UIApp'
import log from 'loglevel'
import { configI18n } from './configI18n'
import App from './App'
import appTheme from './theme'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const { NODE_ENV, REACT_APP_DHIS2_BASE_URL } = process.env
const isProduction = NODE_ENV === 'production'

/**
 * Configure logging
 */

log.setLevel(isProduction ? log.levels.INFO : log.levels.DEBUG)

/**
 * Render app
 */

ReactDOM.render(
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
            <App />
        </HashRouter>
    </D2UIApp>,
    document.getElementById('root')
)

getUserSettings().then(userSettings => {
    const { keyUiLocale } = userSettings
    sessionStorage.setItem('uiLocale', keyUiLocale || 'en')

    configI18n(userSettings)
})

/**
 * Service worker
 */

registerServiceWorker()
