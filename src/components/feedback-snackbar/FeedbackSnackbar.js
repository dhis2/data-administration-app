import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'material-ui';

import styles from './FeedbackSnackbar.css';

import { LOADING, SUCCESS, ERROR, WARNING, ACTION_MESSAGE } from './SnackbarTypes';
import FeedbackSnackbarBody from './feedback-snackbar-body/FeedbackSnackbarBody';

class FeedbackSnackbar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        conf: PropTypes.shape({
            type: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            action: PropTypes.string,
            onActionClick: PropTypes.func,
        }).isRequired,
    };

    static contextTypes = {
        translator: PropTypes.func,
        updateAppState: PropTypes.func,
    };

    static getStyle(type) {
        switch (type) {
        case SUCCESS:
            return styles.success;
        case LOADING:
            return styles.loading;
        case ERROR:
            return styles.error;
        case WARNING:
            return styles.warning;
        default:
            return null;
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            style: styles.warning,
            snackBarContent: '',
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            style: FeedbackSnackbar.getStyle(props.conf.type),
            show: props.show,
            snackBarContent: props.conf.type === ACTION_MESSAGE
                ? props.conf.message
                : (<FeedbackSnackbarBody type={props.conf.type} message={props.conf.message} />),
        });
    }

    handleRequestClose = () => {
        if (this.props.conf.type !== LOADING) {
            this.context.updateAppState({
                showSnackbar: false,
            });
        }
    };

    render() {
        return (
            <Snackbar
                action={this.props.conf.action}
                onActionClick={this.props.conf.onActionClick}
                open={this.state.show}
                message={this.state.snackBarContent}
                onRequestClose={this.handleRequestClose}
                className={this.state.style}
            />
        );
    }
}

export default FeedbackSnackbar;
