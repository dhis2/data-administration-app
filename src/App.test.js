/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { Route } from 'react-router-dom';
import { List  } from 'material-ui';

import HeaderBar from 'd2-ui/lib/app-header/HeaderBar';

import App from './App';

import { sections } from './pages/sections.conf';

jest.mock('d2-ui/lib/app-header/HeaderBar', () => ('HeaderBar'));
jest.mock('d2-ui/lib/app-header/headerBar.store', () => ({}));
jest.mock('d2-ui/lib/component-helpers/withStateFrom', () => () => ('HeaderBar'));

const t = jest.fn();
const notifySidebar = jest.fn();

const ownShallow = () => {
    return shallow(
        <App t={t} notifySidebar={notifySidebar}/>,
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

it('App renders a List Component for the Sidebar', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(List)).toHaveLength(1);
});

it('App renders the correct number of Route components', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Route)).toHaveLength(sections.length + 1);  // section routes plus no match route
});
