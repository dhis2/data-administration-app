/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import ResourceTablePage from './ResourceTable';
import PageContainer from "../PageContainer";
import ResourceTableContainer from "./ResourceTableContainer";

import {
    sections,
    RESOURCE_TABLE_SECTION_KEY,
} from '../sections.conf';

let resourceTablePageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === RESOURCE_TABLE_SECTION_KEY) {
        resourceTablePageInfo = section.info;
        break;
    }
}

const t = key => key;

it('ResourceTablePage renders without crashing', () => {
    shallow(<ResourceTablePage pageInfo={resourceTablePageInfo} t={t} />);
});

it('ResourceTablePage renders a PageContainer', () => {
    const wrapper = shallow(<ResourceTablePage pageInfo={resourceTablePageInfo} t={t} />);
    expect(wrapper.find(PageContainer)).toHaveLength(1);
});

it('ResourceTablePage renders a ResourceTableContainer', () => {
    const wrapper = shallow(<ResourceTablePage pageInfo={resourceTablePageInfo} t={t} />);
    expect(wrapper.find(ResourceTableContainer)).toHaveLength(1);
});




