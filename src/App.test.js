/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import App from './App';

import SidebarMenu from './components/sidebar-menu/SidebarMenu';
import AppRouter from './components/app-router/AppRouter';
import HeaderBar from 'd2-ui/lib/app-header/HeaderBar';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';

jest.mock('d2-ui/lib/app-header/HeaderBar', () => ('HeaderBar'));
jest.mock('d2-ui/lib/app-header/headerBar.store', () => ({}));
jest.mock('d2-ui/lib/component-helpers/withStateFrom', () => () => ('HeaderBar'));
jest.mock('d2-ui/lib/circular-progress/CircularProgress', () => ('CircularProgress'));

const t = jest.fn();

const ownShallow = () => {
    return shallow(
        <App t={t} />,
        {
            disableLifecycleMethods: true
        }
    );
};

it('renders without crashing', () => {
    ownShallow();
});

it('App renders a HeaderBar Component', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(HeaderBar)).toHaveLength(1);
});

it('App renders a SidebarMenu', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(SidebarMenu)).toHaveLength(1);
});

it('App renders a AppRouter', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(AppRouter)).toHaveLength(1);
});
