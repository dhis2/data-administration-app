import React from 'react';
import { shallow, mount } from 'enzyme';
import { Card, CardHeader, CardText, FontIcon } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DataIntegrityCard from './DataIntegrityCard';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));
jest.mock('d2-ui/lib/pagination/Pagination.component', () => ('Pagination'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

const errorArrayCardSample = {
    title: 'Integrity Check Array - With Errors',
    content: ['Check 1', 'Check 2', 'Check 3'],
};

const errorArray_ArrayCardSample = {
    title: 'Integrity Check Array/Array - With Errors',
    content: [['Check 1', 'Check 2', 'Check 3']],
};

const errorObjectString = {
    title: 'Integrity Check Object/String - With Errors',
    content: {
        'IDSR Measles': 'IDSR Weekly (Start Wednesday)',
        'IDSR Malaria': 'IDSR Weekly (Start Wednesday)',
    },
};

const errorObjectCardSample = {
    title: 'Integrity Check Object - With Errors',
    content: {
        'IDSR Measles': ['IDSR Weekly (Start Wednesday)', 'IDSR Weekly'],
        'IDSR Malaria': ['IDSR Weekly (Start Wednesday)', 'IDSR Weekly'],
        'IDSR Yellow fever': ['IDSR Weekly (Start Wednesday)', 'IDSR Weekly'],
        'IDSR Cholera': ['IDSR Weekly (Start Wednesday)', 'IDSR Weekly'],
        'IDSR Plague': ['IDSR Weekly (Start Wednesday)', 'IDSR Weekly'],
    },
};

const noErrorCardSample = {
    title: 'Integrity Check - No Errors 1',
};

const ownShallowError = (data) => {
    return shallow(
        <DataIntegrityCard title={data.title} content={data.content}/>,
        {
            disableLifecycleMethods: true,
        },
    );
};

const ownShallowNoError = () => {
    return shallow(
        <DataIntegrityCard title={noErrorCardSample.title} />,
        {
            disableLifecycleMethods: true,
        },
    );
};

it('DataIntegrityCard - error card has correct title style when typeof Array.', () => {
    const wrapper = ownShallowError(errorArrayCardSample);
    expect(wrapper.find(Card).find({ titleColor: '#ff5722' })).toHaveLength(1);
});

it('DataIntegrityCard - error card renders correct number of fields when typeof Array.', () => {
    const wrapper = ownShallowError(errorArrayCardSample);
    expect(wrapper.find(Card).find(CardText).find('p')).toHaveLength(3);
});

it('DataIntegrityCard - error card renders correct error content when typeof Array.', () => {
    const wrapper = ownShallowError(errorArrayCardSample);
    expect(wrapper.find(Card).find(CardText).find('p').first().text()).toBe('Check 1');
    expect(wrapper.find(Card).find(CardText).find('p').at(1).text()).toBe('Check 2');
});

it('DataIntegrityCard - error card renders correct error content when typeof Array inside Array', () => {
    const wrapper = ownShallowError(errorArray_ArrayCardSample);
    expect(wrapper.find(Card).find(CardText).find('p').first().text()).toBe('Check 1, Check 2, Check 3');
});

it('DataIntegrityCard - error card has correct title style when typeof {}.', () => {
    const wrapper = ownShallowError(errorObjectCardSample);
    expect(wrapper.find(Card).find({ titleColor: '#ff5722' })).toHaveLength(1);
});

it('DataIntegrityCard - error card renders correct number of fields when typeof {}.', () => {
    const wrapper = ownShallowError(errorObjectCardSample);
    expect(wrapper.find(Card).find(CardText).find('span')).toHaveLength(5);
});

it('DataIntegrityCard - error card renders correct error content when typeof {}.', () => {
    const wrapper = ownShallowError(errorObjectCardSample);
    expect(wrapper.find(Card).find(CardText).find('span').first().find('h4').text()).toBe('IDSR Measles');
    expect(wrapper.find(Card).find(CardText).find('span').first().find('p').text()).toBe('IDSR Weekly (Start' +
        ' Wednesday), IDSR Weekly');
});

it('DataIntegrityCard - error card renders correct error content when typeof {} - just strings.', () => {
    const wrapper = ownShallowError(errorObjectString);
    expect(wrapper.find(Card).find(CardText).find('span').first().find('h4').text()).toBe('IDSR Measles');
    expect(wrapper.find(Card).find(CardText).find('span').first().find('p').text()).toBe('IDSR Weekly (Start' +
        ' Wednesday)');
});

it('DataIntegrityCard - error card renders correct open button.', () => {
    const wrapper = ownShallowError(errorArrayCardSample);
    const openIcon = wrapper.find(Card).find(CardHeader).prop('openIcon');
    const fontIconElement = mount(<MuiThemeProvider>{openIcon}</MuiThemeProvider>);
    expect(fontIconElement.find(FontIcon).find('span.material-icons')).toHaveLength(1);
    expect(fontIconElement.find(FontIcon).find('span.material-icons').text()).toBe('keyboard_arrow_up');
});

it('DataIntegrityCard - error card renders correct close button.', () => {
    const wrapper = ownShallowError(errorArrayCardSample);
    const openIcon = wrapper.find(Card).find(CardHeader).prop('closeIcon');
    const fontIconElement = mount(<MuiThemeProvider>{openIcon}</MuiThemeProvider>);
    expect(fontIconElement.find(FontIcon).find('span.material-icons')).toHaveLength(1);
    expect(fontIconElement.find(FontIcon).find('span.material-icons').text()).toBe('keyboard_arrow_down');
});

it('DataIntegrityCard - no error card renders without crashing.', () => {
    ownShallowNoError(noErrorCardSample);
});

it('DataIntegrityCard - no error card has correct title style.', () => {
    const wrapper = ownShallowNoError(noErrorCardSample);
    expect(wrapper.find(Card).find({ titleColor: '#1c9d17' })).toHaveLength(1);
});

it('DataIntegrityCard - no error card renders correct icon.', () => {
    const wrapper = ownShallowNoError(noErrorCardSample);
    const openIcon = wrapper.find(Card).find(CardHeader).prop('openIcon');
    let fontIconElement = mount(<MuiThemeProvider>{openIcon}</MuiThemeProvider>);
    expect(fontIconElement.find(FontIcon).find('span.material-icons')).toHaveLength(1);
    expect(fontIconElement.find(FontIcon).find('span.material-icons').text()).toBe('done');
    const closeIcon = wrapper.find(Card).find(CardHeader).prop('closeIcon');
    fontIconElement = mount(<MuiThemeProvider>{closeIcon}</MuiThemeProvider>);
    expect(fontIconElement.find(FontIcon).find('span.material-icons')).toHaveLength(1);
    expect(fontIconElement.find(FontIcon).find('span.material-icons').text()).toBe('done');
});
