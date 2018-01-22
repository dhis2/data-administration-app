/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import MaintenanceContainer from "./MaintenanceContainer";

import {
    sections,
    MAINTENANCE_SECTION_KEY,
} from '../sections.conf';
import Maintenance from "./Maintenance";
import PageContainer from "../PageContainer";

let maintenancePageInfo = {};
let toggleLoading = () => {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === MAINTENANCE_SECTION_KEY) {
        maintenancePageInfo = section.info;
        break;
    }
}

const t = key => key;

it('Maintenance renders without crashing', () => {
    shallow(<Maintenance pageInfo={maintenancePageInfo} toggleLoading={toggleLoading} t={t} />);
});

it('Maintenance renders a PageContainer', () => {
    const wrapper = shallow(<Maintenance pageInfo={maintenancePageInfo} toggleLoading={toggleLoading} t={t} />);
    expect(wrapper.find(PageContainer)).toHaveLength(1);
});

it('Maintenance renders a MaintenanceContainer', () => {
    const wrapper = shallow(<Maintenance pageInfo={maintenancePageInfo} toggleLoading={toggleLoading} t={t} />);
    expect(wrapper.find(MaintenanceContainer)).toHaveLength(1);
});
