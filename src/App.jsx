import './locales/index.js'
import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import styles from './App.module.css'
import Routes from './components/Routes/Routes.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'

const App = () => (
    <HashRouter>
        <CssVariables spacers colors />
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>

            <main className={styles.content}>
                <Routes />
            </main>
        </div>
    </HashRouter>
)

export default App
