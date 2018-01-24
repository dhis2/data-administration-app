/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Maintenance from "./Maintenance";
import MaintenanceContainer from "./MaintenanceContainer";
import PageContainer from "../PageContainer";

import {
    sections,
    MAINTENANCE_SECTION_KEY,
} from '../sections.conf';

let maintenancePageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === MAINTENANCE_SECTION_KEY) {
        maintenancePageInfo = section.info;
        break;
    }
}

const t = jest.fn();
const updateAppState = jest.fn();

const ownShallow = () => {
    return shallow(
        <Maintenance
            pageInfo={maintenancePageInfo}
            updateAppState={updateAppState}
            t={t}
        />,
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
