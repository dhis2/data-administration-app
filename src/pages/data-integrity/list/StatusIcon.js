import React from 'react'
import {
    CircularLoader,
    IconCheckmark16,
    IconCheckmarkCircle16,
    IconCheckmarkCircle24,
    IconError16,
    IconErrorFilled16,
    IconErrorFilled24,
} from '@dhis2/ui'
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

    return <ErrorIcon numberOfErrors={count} />
}
