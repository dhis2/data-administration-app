/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import PageContainer from "./PageContainer";

const fakeHeader = 'Header';
const fakePageContent = (<p>Content</p>);

it('renders without crashing', () => {
    shallow(<PageContainer header={fakeHeader}>{fakePageContent}</PageContainer>);
});

it('PageContainer renders a h1', () => {
    const wrapper = shallow(<PageContainer header={fakeHeader}>{fakePageContent}</PageContainer>);
    expect(wrapper.find('h1')).toHaveLength(1);
});

it('PageContainer renders a Card', () => {
    const wrapper = shallow(<PageContainer header={fakeHeader}>{fakePageContent}</PageContainer>);
    expect(wrapper.find(Card)).toHaveLength(1);
});

it('PageContainer renders a CardText', () => {
    const wrapper = shallow(<PageContainer header={fakeHeader}>{fakePageContent}</PageContainer>);
    expect(wrapper.find(CardText)).toHaveLength(1);
});


