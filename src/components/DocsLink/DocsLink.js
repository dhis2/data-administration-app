import { useConfig } from '@dhis2/app-runtime'
import { colors, Tooltip, IconQuestion24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { getDocsKeyForSection } from '../../pages/sections.conf.js'
import styles from './DocsLink.module.css'

const getDocsVersion = ({ major, minor, tag }) => {
    if (tag === 'SNAPSHOT') {
        return 'master'
    }
    return `${major}${minor}`
}

const DocsLink = ({ sectionKey }) => {
    const { serverVersion } = useConfig()
    const docsVersion = getDocsVersion(serverVersion)
    const docsKey = getDocsKeyForSection(sectionKey)

    return (
        <Tooltip
            content={i18n.t('Open user guide')}
            placement="bottom"
            openDelay={0}
            closeDelay={0}
        >
            <a
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://docs.dhis2.org/en/use/user-guides/dhis-core-version-${docsVersion}/maintaining-the-system/data-administration.html#${docsKey}`}
            >
                <IconQuestion24 color={colors.blue700} />
            </a>
        </Tooltip>
    )
}

DocsLink.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default DocsLink
