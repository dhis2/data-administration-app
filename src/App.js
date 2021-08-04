import './locales'

import { CssVariables } from '@dhis2/ui'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import styles from './App.module.css'
import Routes from './components/Routes/Routes'
import Sidebar from './components/Sidebar/Sidebar'
import muiTheme from './theme'
import 'material-design-icons-iconfont'

const App = () => (
    <HashRouter>
        <CssVariables spacers colors />
        <MuiThemeProvider muiTheme={muiTheme}>
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
        </MuiThemeProvider>
    </HashRouter>
)

export default App
