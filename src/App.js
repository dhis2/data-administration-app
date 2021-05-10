import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import { MuiThemeProvider } from 'material-ui/styles'
import React, { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import styles from './App.module.css'
import Routes from './components/Routes/Routes'
import Sidebar from './components/Sidebar/Sidebar'
import { injectTranslationsToD2 } from './configI18n'
import muiTheme from './theme'
import 'material-design-icons-iconfont'
import './locales'

const App = () => {
    const { d2 } = useD2()
    useEffect(() => {
        if (d2) {
            injectTranslationsToD2(d2)
        }
    }, [d2])

    if (!d2) {
        return null
    }

    return (
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
}

export default App
