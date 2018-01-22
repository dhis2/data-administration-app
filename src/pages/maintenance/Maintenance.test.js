/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import MaintenanceContainer from "./MaintenanceContainer";

import {
    sections,
    MAINTENANCE_SECTION_KEY,
} from '../sections.conf';
import MaintenancePage from "./Maintenance";
import PageContainer from "../PageContainer";

let maintenancePageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === MAINTENANCE_SECTION_KEY) {
        maintenancePageInfo = section.info;
        break;
    }
}

const t = key => key;

it('Maintenance renders without crashing', () => {
    shallow(<MaintenancePage pageInfo={maintenancePageInfo} t={t} />);
});

it('Maintenance renders a PageContainer', () => {
    const wrapper = shallow(<MaintenancePage pageInfo={maintenancePageInfo} t={t} />);
    expect(wrapper.find(PageContainer)).toHaveLength(1);
});

it('Maintenance renders a MaintenanceContainer', () => {
    const wrapper = shallow(<MaintenancePage pageInfo={maintenancePageInfo} t={t} />);
    expect(wrapper.find(MaintenanceContainer)).toHaveLength(1);
});
