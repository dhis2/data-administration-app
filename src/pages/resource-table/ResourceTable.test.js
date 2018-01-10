/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';

import ResourceTablePage from './ResourceTablePage';
import PageContainer from "../PageContainer";
import ResourceTableContainer from "./ResourceTableContainer";

import resourceTable from "./resourceTable.conf";

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
const showSnackbar = jest.fn();

it('ResourceTableContainer renders without crashing', () => {
    shallow(<ResourceTableContainer t={t} showSnackbar={showSnackbar} />);
});

it('ResourceTableContainer renders a GridList', () => {
    const wrapper = shallow(<ResourceTableContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(GridList)).toHaveLength(1);
});

it('ResourceTableContainer renders the correct number of GridTiles', () => {
    const wrapper = shallow(<ResourceTableContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(GridTile)).toHaveLength(resourceTable.length);
});

it('ResourceTableContainer renders a Button', () => {
    const wrapper = shallow(<ResourceTableContainer t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find('.resource-table-action-button')).toHaveLength(1);
});

it('ResourceTableContainer calls generateTables function when button is clicked', () => {
    const spy = spyOn(ResourceTableContainer.prototype, 'generateTables')
    const wrapper = shallow(<ResourceTableContainer t={t} showSnackbar={showSnackbar} />);
    wrapper.find('.resource-table-action-button').simulate('click');
    expect(spy).toHaveBeenCalled();
});

it('ResourceTablePage renders without crashing', () => {
    shallow(<ResourceTablePage pageInfo={resourceTablePageInfo} t={t} showSnackbar={showSnackbar} />);
});

it('ResourceTablePage renders a PageContainer', () => {
    const wrapper = shallow(<ResourceTablePage pageInfo={resourceTablePageInfo} t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(PageContainer)).toHaveLength(1);
});

it('ResourceTablePage renders a ResourceTableContainer', () => {
    const wrapper = shallow(<ResourceTablePage pageInfo={resourceTablePageInfo} t={t} showSnackbar={showSnackbar} />);
    expect(wrapper.find(ResourceTableContainer)).toHaveLength(1);
});




