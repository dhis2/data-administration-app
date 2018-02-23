import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'material-ui';

import styles from './FeedbackSnackbar.css';

import { LOADING, SUCCESS, ERROR } from './SnackbarTypes';
import FeedbackSnackbarBody from './feedback-snackbar-body/FeedbackSnackbarBody';

const jsStyles = {
    snackbarBodyStyle: {
        lineHeight: 'normal',
        padding: '10px',
        height: 'auto',
    },
};

class FeedbackSnackbar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        conf: PropTypes.shape({
            type: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
        }).isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
        updateAppState: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            delayLoading: false,
            style: styles.warning,
        };
    }

    componentWillReceiveProps(props) {
        switch (props.conf.type) {
        case SUCCESS:
            this.setState({ style: styles.success });
            break;
        case LOADING:
            this.setState({ style: styles.loading });
            break;
        case ERROR:
            this.setState({ style: styles.error });
            break;
        default:
            this.setState({ style: styles.warning });
            break;
        }
        this.setState({
            show: props.show,
        });
        if (props.conf.type === LOADING) {
            setTimeout(() => { this.setState({ delayLoading: false }); }, 500);
            this.setState({
                delayLoading: true,
            });
        }
        this.forceUpdate();
    }

    handleRequestClose = () => {
        if (this.props.conf.type !== LOADING) {
            this.context.updateAppState({
                showSnackbar: false,
            });
        }
    }

    render() {
        if (!this.state.show || this.state.delayLoading) {
            return null;
        }
        const snackBarContent = <FeedbackSnackbarBody type={this.props.conf.type} message={this.props.conf.message} />;
        return (
            <Snackbar
                open={this.state.show}
                message={snackBarContent}
                onRequestClose={this.handleRequestClose}
                bodyStyle={jsStyles.snackbarBodyStyle}
                className={this.state.style}
            />
        );
    }
}

export default FeedbackSnackbar;
