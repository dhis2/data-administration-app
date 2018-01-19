/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { GridList } from 'material-ui/GridList';

import Homepage from './Home';
import GridSection from './grid-section/GridSection';

import { sections } from '../sections.conf';

const t = key => key;

it('Homepage renders without crashing', () => {
    shallow(<Homepage t={t}/>);
});

it('Homepage renders a GridList', () => {
    const wrapper = shallow(<Homepage t={t}/>);
    expect(wrapper.find(GridList)).toHaveLength(1);
});

it('ResourceTableContainer renders the correct number of GridSection', () => {
    const wrapper = shallow(<Homepage t={t}/>);
    expect(wrapper.find(GridSection)).toHaveLength(sections.length - 1);    // Home should not be rendered to the list
});

