/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { GridList, GridTile } from 'material-ui/GridList';
import { Link } from 'react-router-dom';

import Homepage from './Homepage';
import GridSection from './GridSection';

import { sections } from '../sections.conf';

const t = key => key;

it('Homepage renders without crashing', () => {
    shallow(<Homepage t={t}/>);
});

it('Homepage renders a GridList', () => {
    const wrapper = shallow(<Homepage t={t}/>);
    expect(wrapper.find(GridList)).toHaveLength(1);
});

it('ResourceTableContainer renders the correct number of GridTiles', () => {
    const wrapper = shallow(<Homepage t={t}/>);
    expect(wrapper.find(GridSection)).toHaveLength(sections.length - 1);    // Home should not be rendered to the list
});

it('GridSection renders without crashing', () => {
    const section = sections[0];
    shallow(<GridSection t={t} section={section}/>);
});

it('GridSection renders a Link', () => {
    const section = sections[0];
    const wrapper = shallow(<GridSection t={t} section={section}/>);
    expect(wrapper.find(Link)).toHaveLength(1);
});

it('GridSection renders a GridTile', () => {
    const section = sections[0];
    const wrapper = shallow(<GridSection t={t} section={section}/>);
    expect(wrapper.find(GridTile)).toHaveLength(1);
});