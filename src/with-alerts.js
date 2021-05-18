import { useAlert } from '@dhis2/app-runtime'
import React from 'react'

export const withAlerts = Component => {
    return function ComponentWithAlerts(props) {
        const alert = useAlert(
            ({ message }) => message,
            options => options
        )
        return <Component {...props} alert={alert} />
    }
}
