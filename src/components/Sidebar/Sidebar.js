import { Menu } from '@dhis2/ui'
import React from 'react'
import { sections } from '../../pages/sections.conf'
import SidebarItem from './SidebarItem'

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
