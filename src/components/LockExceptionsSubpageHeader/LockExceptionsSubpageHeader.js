import i18n from '@dhis2/d2-i18n'
import classnames from 'classnames'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './LockExceptionsSubpageHeader.module.css'

const LockExceptionsSubpageHeader = ({ title }) => (
    <div className={styles.headerContainer}>
        <Link to="/lock-exceptions">
            <span title={i18n.t('Go back to all lock exceptions')}>
                <FontIcon
                    className={classnames(
                        'material-icons',
                        styles.backArrowIcon
                    )}
                >
                    arrow_back
                </FontIcon>
            </span>
        </Link>
        <h1 className={styles.header}>
            <span>{i18n.t('Lock Exception')}</span>
            <span className={styles.headerDivider}> | </span>
            <span className={styles.subHeader}>{title}</span>
        </h1>
    </div>
)

LockExceptionsSubpageHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

export default LockExceptionsSubpageHeader
