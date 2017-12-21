// React
import React from 'react';
import ReactDOM from 'react-dom';

// D2
import { getManifest } from 'd2/lib/d2';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

// logging
import log from 'loglevel';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.DEBUG);

// init d2
getManifest('manifest.webapp').then(manifest => {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? manifest.getBaseUrl()
            : process.env.REACT_APP_DHIS2_BASE_URL;

    ReactDOM.render(
        <D2UIApp
            initConfig={{
                baseUrl: `${baseUrl}/api/${process.env.REACT_APP_DHIS2_API_VERSION}`,
            }}
        >
            <App />
        </D2UIApp>,
        document.getElementById('root')
    );
});

registerServiceWorker();
