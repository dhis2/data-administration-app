import { PropTypes } from '@dhis2/prop-types'
import { Menu, MenuItem } from '@dhis2/ui'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { sections } from '../../pages/sections.conf'
import styles from './Sidebar.module.css'

const SidebarItem = ({ label, path }) => {
    const history = useHistory()
    const isActive = !!useRouteMatch(path)
    const navigateToPath = () => history.push(path)

    return (
        <MenuItem
            className={styles.sidebarItem}
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

const Sidebar = () => (
    <Menu>
        {sections.map(section => (
            <SidebarItem
                key={section.key}
                label={section.info.label}
                path={section.path}
            />
        ))}
    </Menu>
)

export default Sidebar
