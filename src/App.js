import './locales/index.js'
import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import styles from './App.module.css'
import Routes from './components/Routes/Routes.js'
import Sidebar from './components/Sidebar/Sidebar.js'

const App = () => (
    <HashRouter>
        <CssVariables spacers colors />
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>

            <main className={styles.content}>
                <div className={styles.contentWrapper}>
                    <Routes />
                </div>
            </main>
        </div>
    </HashRouter>
)

export default App
