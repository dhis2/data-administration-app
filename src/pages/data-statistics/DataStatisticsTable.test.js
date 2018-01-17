/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

// Material UI
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui/Table';

import DataStatisticsTable from './DataStatisticsTable';

const t = key => key;
const tableSample = {
    label: 'Object type',
    elements: [
        { label: 'object1', count: 1 },
        { label: 'object2', count: 2 }
    ],
};

it('DataStatisticsTable renders without crashing', () => {
    shallow(<DataStatisticsTable t={t} label={tableSample.label} elements={tableSample.elements}/>);
});

it('DataStatisticsTable renders a Table', () => {
    const wrapper = shallow(<DataStatisticsTable t={t} label={tableSample.label} elements={tableSample.elements}/>);
    expect(wrapper.find(Table)).toHaveLength(1);
});

it('DataStatisticsTable renders a TableHeader inside Table', () => {
    const wrapper = shallow(<DataStatisticsTable t={t} label={tableSample.label} elements={tableSample.elements}/>);
    expect(wrapper.find(Table).find(TableHeader)).toHaveLength(1);
});

it('DataStatisticsTable renders a TableRow inside TableHeader', () => {
    const wrapper = shallow(<DataStatisticsTable t={t} label={tableSample.label} elements={tableSample.elements}/>);
    expect(wrapper.find(Table).find(TableHeader).find(TableRow)).toHaveLength(1);
});

it('DataStatisticsTable renders a TableBody inside Table', () => {
    const wrapper = shallow(<DataStatisticsTable t={t} label={tableSample.label} elements={tableSample.elements}/>);
    expect(wrapper.find(Table).find(TableBody)).toHaveLength(1);
});

it('DataStatisticsTable renders the correct number of TableRows', () => {
    const wrapper = shallow(<DataStatisticsTable t={t} label={tableSample.label} elements={tableSample.elements}/>);
    expect(wrapper.find(Table).find(TableBody).find(TableRow)).toHaveLength(tableSample.elements.length);
});