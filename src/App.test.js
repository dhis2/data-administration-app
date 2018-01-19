/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import App from './App';

import SidebarMenu from './components/sidebar-menu/SidebarMenu';
import AppRouter from './components/app-router/AppRouter';
import HeaderBar from 'd2-ui/lib/app-header/HeaderBar';

jest.mock('d2-ui/lib/app-header/HeaderBar', () => ('HeaderBar'));
jest.mock('d2-ui/lib/app-header/headerBar.store', () => ({}));
jest.mock('d2-ui/lib/component-helpers/withStateFrom', () => () => ('HeaderBar'));

const t = jest.fn();

it('renders without crashing', () => {
    shallow(<App t={t} />);
});

it('App renders a HeaderBar Component', () => {
    const wrapper = shallow(<App t={t} />);
    expect(wrapper.find(HeaderBar)).toHaveLength(1);
});

it('App renders a SidebarMenu Component', () => {
    const wrapper = shallow(<App t={t} />);
    expect(wrapper.find(SidebarMenu)).toHaveLength(1);
});

it('App renders an AppRouter Component', () => {
    const wrapper = shallow(<App t={t} />);
    expect(wrapper.find(AppRouter)).toHaveLength(1);
});
