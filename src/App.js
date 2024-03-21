import './locales/index.js'
import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5'
import styles from './App.module.css'
import Routes from './components/Routes/Routes.js'
import Sidebar from './components/Sidebar/Sidebar.js'

const App = () => (
    <HashRouter>
        <QueryParamProvider adapter={ReactRouter5Adapter}>
            <CssVariables spacers colors />
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Sidebar />
                </div>

                <main className={styles.content}>
                    <Routes />
                </main>
            </div>
        </QueryParamProvider>
    </HashRouter>
)

export default App
