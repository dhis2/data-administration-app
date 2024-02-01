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

export const StatusIcon = ({ check, loading }) => {
    if (loading) {
        return <LoadingIcon />
    }
    if (!check?.runInfo?.finishedTime) {
        return null
    }

    const isSuccess = check.runInfo.finishedTime && check.runInfo.count === 0
    if (isSuccess) {
        return <SuccessIcon />
    }

    return <ErrorIcon numberOfErrors={check.runInfo.count} />
}
