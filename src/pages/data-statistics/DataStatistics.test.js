/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import DataStatisticsPage from './DataStatisticsPage';
import DataStatisticsTable from './DataStatisticsTable';

const t = key => key;
const stateWithTablesForDataStatistics = [
    {
        label: 'Object type',
        elements: [
            { label: 'object1', count: 1 },
            { label: 'object2', count: 2 }
        ],
    },
    {
        label: 'Users logged in',
        elements: [
            { label: 'Today', count: 2 },
            { label: 'Last hour', count: 1 }
        ],
    },
];

it('DataStatisticsPage renders without crashing', () => {
    shallow(<DataStatisticsPage t={t}/>);
});

it('DataStatisticsPage renders no DataStatisticsTable', () => {
    const wrapper = shallow(<DataStatisticsPage t={t}/>);
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(0);
});

it('DataStatisticsPage renders DataStatisticsTable define on state', () => {
    const wrapper = shallow(<DataStatisticsPage t={t}/>);
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(0);
    wrapper.setState({tables: stateWithTablesForDataStatistics});
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(stateWithTablesForDataStatistics.length);
});