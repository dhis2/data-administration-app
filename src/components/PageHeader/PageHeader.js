import PropTypes from 'prop-types'
import React from 'react'
import DocsLink from '../DocsLink/DocsLink.js'
import styles from './PageHeader.module.css'

const PageHeader = ({ title, sectionKey }) => (
    <header className={styles.header}>
        <h1 className={styles.headerTitle}>{title}</h1>
        <DocsLink sectionKey={sectionKey} />
    </header>
)

PageHeader.propTypes = {
    sectionKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}

export default PageHeader
