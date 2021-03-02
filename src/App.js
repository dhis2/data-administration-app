import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import App from './components/App'
import './locales'

const AppWrapper = () => {
    const { d2 } = useD2()

    if (!d2) {
        return null
    }

    return (
        <HashRouter>
            <App d2={d2} />
        </HashRouter>
    )
}

export default AppWrapper
