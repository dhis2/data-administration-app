/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { Link } from "react-router-dom";
import { GridTile } from "material-ui/GridList/index";

import GridSection from './GridSection';

import {sections} from "../../sections.conf";

const t = key => key;

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