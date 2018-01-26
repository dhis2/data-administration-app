/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { GridList } from 'material-ui/GridList';

import Homepage from './Home';
import GridSection from './grid-section/GridSection';

import { sections } from '../sections.conf';

const t = jest.fn();
const updateAppState = jest.fn();

const ownShallow = () => {
    return shallow(
        <Homepage t={t} updateAppState={updateAppState}/>,
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

it('Home renders the correct number of GridSection', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(GridSection)).toHaveLength(sections.length);
});

