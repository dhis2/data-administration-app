import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import css from './ErrorOrLoading.module.css'

const Centered = ({ children }) => (
    <div className={css.centered}>{children}</div>
)

Centered.propTypes = { children: PropTypes.node }

export const ErrorOrLoading = ({ error, loading, children }) => {
    if (error) {
        const message = error?.message || i18n.t('An unknown error occurred')

        return (
            <Centered>
                <NoticeBox error title={i18n.t('Failed to load')}>
                    {message}
                </NoticeBox>
            </Centered>
        )
    }

    if (loading) {
        return (
            <Centered position="top">
                <CircularLoader />
            </Centered>
        )
    }

    return children
}

ErrorOrLoading.propTypes = {
    children: PropTypes.node,
    error: PropTypes.object,
    loading: PropTypes.bool,
}
