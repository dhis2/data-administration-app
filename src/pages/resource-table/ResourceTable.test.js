/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import ResourceTable from './ResourceTable';

it('renders without crashing', () => {
    const t = key => key;
    const showSnackbar = jest.fn();
    shallow(<ResourceTable t={t} showSnackbar={showSnackbar} />);
});

