import PropTypes from 'prop-types'
import React from 'react'
import DocsLink from '../DocsLink/DocsLink'
import styles from './PageHeader.module.css'

const PageHeader = ({ title, sectionKey }) => (
    <h1 className={styles.header}>
        {title}
        <DocsLink sectionKey={sectionKey} />
    </h1>
)

PageHeader.propTypes = {
    sectionKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}

export default PageHeader
