/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { Snackbar } from 'material-ui';

import FeedbackSnackbar from './FeedbackSnackbar';
import { ACTION_MESSAGE, ERROR, LOADING, SUCCESS, WARNING } from './FeedbackSnackbarTypes';

import styles from './FeedbackSnackbar.css';
import FeedbackSnackbarBody from './feedback-snackbar-body/FeedbackSnackbarBody';

const loadingProps = {
    show: true,
    conf: {
        type: LOADING,
        message: 'Loading...',
    },
};

const successProps = {
    show: true,
    conf: {
        type: SUCCESS,
        message: 'Success...',
    },
};

const warningProps = {
    show: true,
    conf: {
        type: WARNING,
        message: 'Warning...',
    },
};

const errorProps = {
    show: true,
    conf: {
        type: ERROR,
        message: 'Error...',
    },
};

const actionProps = {
    show: true,
    conf: {
        type: ACTION_MESSAGE,
        message: 'Action...',
    },
};

const ownShallow = (props) => {
    return shallow(
        <FeedbackSnackbar show={props.show} conf={props.conf} />,
        {
            context: {
                updateAppState: jest.fn(),
                translator: key => key,
            },
        },
    );
};

it('FeedbackSnackbar renders LOADING correctly.', () => {
    const wrapper = ownShallow(loadingProps);
    wrapper.setProps(loadingProps.show, loadingProps.conf);
    expect(wrapper.find(Snackbar)).toHaveLength(1);
    expect(wrapper.find(Snackbar).prop('message'))
        .toMatchObject(<FeedbackSnackbarBody message={loadingProps.conf.message} type={loadingProps.conf.type} />);
    expect(wrapper.state().show).toBeTruthy();
    expect(wrapper.state().style).toBe(styles.loading);
});

it('FeedbackSnackbar renders SUCCESS correctly.', () => {
    const wrapper = ownShallow(successProps);
    wrapper.setProps(successProps.show, successProps.conf);
    expect(wrapper.find(Snackbar)).toHaveLength(1);
    expect(wrapper.find(Snackbar).prop('message'))
        .toMatchObject(<FeedbackSnackbarBody message={successProps.conf.message} type={successProps.conf.type} />);
    expect(wrapper.state().show).toBeTruthy();
    expect(wrapper.state().style).toBe(styles.success);
});

it('FeedbackSnackbar renders ERROR correctly.', () => {
    const wrapper = ownShallow(errorProps);
    wrapper.setProps(errorProps.show, errorProps.conf);
    expect(wrapper.find(Snackbar)).toHaveLength(1);
    expect(wrapper.find(Snackbar).prop('message'))
        .toMatchObject(<FeedbackSnackbarBody message={errorProps.conf.message} type={errorProps.conf.type} />);
    expect(wrapper.state().show).toBeTruthy();
    expect(wrapper.state().style).toBe(styles.error);
});

it('FeedbackSnackbar renders WARNING correctly.', () => {
    const wrapper = ownShallow(warningProps);
    wrapper.setProps(warningProps.show, warningProps.conf);
    expect(wrapper.find(Snackbar)).toHaveLength(1);
    expect(wrapper.find(Snackbar).prop('message'))
        .toMatchObject(<FeedbackSnackbarBody message={warningProps.conf.message} type={warningProps.conf.type} />);
    expect(wrapper.state().show).toBeTruthy();
    expect(wrapper.state().style).toBe(styles.warning);
});

it('FeedbackSnackbar renders ACTION correctly.', () => {
    const wrapper = ownShallow(actionProps);
    wrapper.setProps(actionProps.show, actionProps.conf);
    expect(wrapper.find(Snackbar)).toHaveLength(1);
    expect(wrapper.find(Snackbar).prop('message')).toBe(actionProps.conf.message);
    expect(wrapper.state().show).toBeTruthy();
});
