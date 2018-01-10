/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

jest.mock('d2-ui/lib/app-header/HeaderBar', () => ('HeaderBar'));
jest.mock('d2-ui/lib/app-header/headerBar.store', () => ({}));
jest.mock('d2-ui/lib/component-helpers/withStateFrom', () => () => ('HeaderBar'));
jest.mock('d2-ui/lib/sidebar/Sidebar.component', () => ('Sidebar'));

it('renders without crashing', () => {
    const history = {
        listen: jest.fn(),
    };
    const t = jest.fn();
    shallow(<App history={history} t={t} />);
});
