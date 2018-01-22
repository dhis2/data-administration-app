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

const t = jest.fn();
const notifySidebar = jest.fn();

const ownShallow = () => {
    return shallow(
        <MaintenancePage pageInfo={maintenancePageInfo} t={t} notifySidebar={notifySidebar} />,
        {
            disableLifecycleMethods: true
        }
    );
};

it('Maintenance renders without crashing', () => {
    ownShallow();
});

it('Maintenance renders a PageContainer', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(PageContainer)).toHaveLength(1);
});

it('Maintenance renders a MaintenanceContainer', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(MaintenanceContainer)).toHaveLength(1);
});
