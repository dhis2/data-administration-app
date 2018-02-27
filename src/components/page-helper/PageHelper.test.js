/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import PageHelper from './PageHelper';
import { Dialog, FontIcon } from 'material-ui';

const ownShallow = () => {
    return shallow(
        <PageHelper pageTitle={'Title'} pageSummary={'Summary'}/>,
        {
            context: {
                translator: key => key,
            },
        },
    );
};

it('Page Helper renders without crashing.', () => {
    ownShallow();
});

it('Page Helper should have correct icon.', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(FontIcon)).toHaveLength(1);
});

it('Page Helper should call open function when icon clicked.', () => {
    const spy = spyOn(PageHelper.prototype, 'handleOpen');
    const wrapper = ownShallow();
    wrapper.find(FontIcon).simulate('click');
    expect(spy).toHaveBeenCalled();
});

it('Page Helper show state should change to true when icon clicked.', () => {
    const wrapper = ownShallow();
    expect(wrapper.state().show).toBeFalsy();
    wrapper.find(FontIcon).simulate('click');
    expect(wrapper.state().show).toBeTruthy();
});

it('Page Helper should have a Dialog component.', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Dialog)).toHaveLength(1);
});
