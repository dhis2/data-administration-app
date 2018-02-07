/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

// Material UI
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
} from 'material-ui/Table';

import DataStatisticsTable from './DataStatisticsTable';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));

const tableSample = {
    label: 'Object type',
    elements: [
        { label: 'object1', count: 1 },
        { label: 'object2', count: 2 }
    ],
};

const ownShallow = () => {
    return shallow(
        <DataStatisticsTable label={tableSample.label} elements={tableSample.elements} />,
        {
            disableLifecycleMethods: true,
            context: {
                t: (key) => key,
            }
        }
    );
};

it('DataStatisticsTable renders without crashing', () => {
    ownShallow();
});

it('DataStatisticsTable renders a Table', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Table)).toHaveLength(1);
});

it('DataStatisticsTable renders a TableHeader inside Table', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Table).find(TableHeader)).toHaveLength(1);
});

it('DataStatisticsTable renders a TableRow inside TableHeader', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Table).find(TableHeader).find(TableRow)).toHaveLength(1);
});

it('DataStatisticsTable renders a TableBody inside Table', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Table).find(TableBody)).toHaveLength(1);
});

it('DataStatisticsTable renders the correct number of TableRows', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Table).find(TableBody).find(TableRow)).toHaveLength(tableSample.elements.length);
});