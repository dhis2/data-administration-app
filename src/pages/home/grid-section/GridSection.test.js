/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { Link } from "react-router-dom";
import { GridTile } from "material-ui/GridList/index";

import GridSection from './GridSection';

import { sections } from "../../sections.conf";

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const section = sections[0];
const ownShallow = () => {
    return shallow(
        <GridSection
            section={section}
        />,
        {
            context: {
                t: (key) => key,
            },
            disableLifecycleMethods: true
        }
    );
};

it('GridSection renders without crashing', () => {
    ownShallow();
});

it('GridSection renders a Link', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Link)).toHaveLength(1);
});

it('GridSection renders a GridTile', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(GridTile)).toHaveLength(1);
});