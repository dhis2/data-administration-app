import { CircularLoader } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import css from './Notice.module.css'

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
    status: PropTypes.oneOf(['loading', 'success', 'error']).isRequired,
    children: PropTypes.node,
    title: PropTypes.string,
}
