/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { GridList } from 'material-ui/GridList';

import Homepage from './Home';
import GridSection from './grid-section/GridSection';

import { sections } from '../sections.conf';

const t = jest.fn();
const notifySidebar = jest.fn();

const ownShallow = () => {
    return shallow(
        <Homepage t={t} notifySidebar={notifySidebar}/>,
        {
            disableLifecycleMethods: true
        }
    );
};

it('Homepage renders without crashing', () => {
    ownShallow();
});

it('Homepage renders a GridList', () => {
    const wrapper = ownShallow();
    expect(wrapper.find('#grid-list-id')).toHaveLength(1);
});

it('ResourceTableContainer renders the correct number of GridSection', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(GridSection)).toHaveLength(sections.length - 1);    // Home should not be rendered to the list
});

