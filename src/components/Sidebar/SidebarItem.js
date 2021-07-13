import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './SidebarItem.module.css'

const SidebarItem = ({ label, path }) => {
    const history = useHistory()
    const isActive = !!useRouteMatch(path)
    const navigateToPath = () => history.push(path)
    const href = history.createHref({
        pathname: path,
        search: '',
        hash: '',
    })

    return (
        <MenuItem
            className={styles.sidebarItem}
            href={href}
            onClick={navigateToPath}
            active={isActive}
            label={label}
        />
    )
}

SidebarItem.propTypes = {
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
}

export default SidebarItem
