import {
    CircularLoader, IconCheckmarkCircle16, IconErrorFilled16
} from '@dhis2/ui'
import React from 'react'
import css from './List.module.css'

export const ErrorIcon = ({ numberOfErrors }) => {
    return (
        <span className={css.errorIcon}>
            <IconErrorFilled16 color="#B71C1C" />
            <span>{numberOfErrors}</span>
        </span>
    )
}

export const SuccessIcon = () => <IconCheckmarkCircle16 color="green" />

export const LoadingIcon = () => <CircularLoader small />

export const StatusIcon = ({ count, loading }) => {
    if (loading) {
        return <LoadingIcon />
    }

    if (count === 0) {
        return <SuccessIcon />
    }
    if(count > 0) {
        return <ErrorIcon numberOfErrors={count} />

    }
    return null
}
