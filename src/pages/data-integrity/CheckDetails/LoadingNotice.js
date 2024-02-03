import { CircularLoader } from '@dhis2/ui'
import React from 'react'
import css from './LoadingNotice.module.css'
import cx from 'classnames'
import PropTypes from 'prop-types'

export const Notice = ({ title, children, status }) => {
    return (
        <div
            className={cx(css.notice, {
                [css.success]: status === 'success',
                [css.error]: status === 'error',
            })}
        >
            {status === 'loading' && <CircularLoader small />}
            <div className={css.contentWrapper}>
                {title && <header>{title}</header>}
                <div className={css.content}>{children}</div>
            </div>
        </div>
    )
}

Notice.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    status: PropTypes.oneOf(['loading', 'success', 'error']).isRequired,
}
