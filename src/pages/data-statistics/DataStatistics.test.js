/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import DataStatistics from './DataStatistics';
import DataStatisticsTable from './DataStatisticsTable';

import {
    sections,
    DATA_STATISTICS_SECTION_KEY, MAINTENANCE_SECTION_KEY
} from '../sections.conf';

let dataStatisticsPageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === DATA_STATISTICS_SECTION_KEY) {
        dataStatisticsPageInfo = section.info;
        break;
    }
}

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

const ownShallow = () => {
    return shallow(
        <DataStatistics
            sectionKey={DATA_STATISTICS_SECTION_KEY}
            pageInfo={dataStatisticsPageInfo}
        />,
        {
            disableLifecycleMethods: true,
            context: {
                updateAppState: jest.fn(),
                t: (key) => key,
            }
        }
    );
};

it('DataStatistics renders without crashing', () => {
    ownShallow();
});

it('DataStatistics renders no DataStatisticsTable', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(0);
});

it('DataStatistics renders DataStatisticsTable define on state', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(0);
    wrapper.setState({tables: stateWithTablesForDataStatistics});
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(stateWithTablesForDataStatistics.length);
});