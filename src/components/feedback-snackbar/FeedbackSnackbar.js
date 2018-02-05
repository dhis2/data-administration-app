import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'material-ui';

import styles from './FeedbackSnackbar.css';

import { LOADING, SUCCESS, ERROR } from './SnackbarTypes';
import FeedbackSnackbarBody from './feedback-snackbar-body/FeedbackSnackbarBody';

class FeedbackSnackbar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        conf: PropTypes.shape({
            type: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
        }).isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            duration: 4000,
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
            duration: 4000,
        });
        if (props.conf.type === LOADING) {
            setTimeout(() => { this.setState({ delayLoading: false }); }, 500);
            this.setState({
                delayLoading: true,
                duration: -1,
            });
        }
        this.forceUpdate();
    }

    handleRequestClose = () => {
        if (this.props.conf.type !== LOADING) {
            this.setState(
                {
                    show: false,
                });
        }
    }

    render() {
        if (!this.state.show || this.state.delayLoading) {
            return null;
        }
        const snackBarBodyStyle = { lineHeight: 'normal', padding: '10px', height: 'auto' };
        const snackBarContent = <FeedbackSnackbarBody type={this.props.conf.type} message={this.props.conf.message} />;
        return (
            <Snackbar
                open={this.state.show}
                autoHideDuration={this.state.duration}
                message={snackBarContent}
                onRequestClose={this.handleRequestClose}
                bodyStyle={snackBarBodyStyle}
                className={this.state.style}
            />
        );
    }
}

export default FeedbackSnackbar;
