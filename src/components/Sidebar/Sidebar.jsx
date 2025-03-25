import { Menu } from '@dhis2/ui'
import React from 'react'
import { sections } from '../../pages/sections.conf.js'
import SidebarItem from './SidebarItem.jsx'

const Sidebar = () => (
    <Menu>
        {sections.map((section) => (
            <SidebarItem
                key={section.key}
                label={section.info.label}
                path={section.path}
            />
        ))}
    </Menu>
)

export default Sidebar
