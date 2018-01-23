/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { List, ListItem } from 'material-ui';
import { Link } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

import { sections } from '../../pages/sections.conf';

const currentSection = sections[0].key;

const ownShallow = () => {
    return shallow(
        <SidebarMenu
            sections={sections}
            currentSection={currentSection}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

it('SidebarMenu renders without crashing', () => {
    ownShallow();
});

it('SidebarMenu renders a List', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(List)).toHaveLength(1);
});

it('SidebarMenu renders the correct number of Links', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Link)).toHaveLength(sections.length);
});

it('SidebarMenu renders the correct number of ListItems', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(ListItem)).toHaveLength(sections.length);
});