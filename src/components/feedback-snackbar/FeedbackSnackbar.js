import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, Snackbar } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import classNames from 'classnames';

import styles from './FeedbackSnackbar.css';

import { LOADING, SUCCESS, ERROR } from './SnackbarTypes';

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
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            show: props.show,
            duration: props.conf.type === LOADING ? -1 : 4000,
        });
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
        if (!this.state.show) {
            return null;
        }
        const translator = this.context.t;
        let snackStyleType;
        let icon;
        const snackBarBodyStyle = {
            lineHeight: 'normal',
            padding: '10px',
            height: 'auto',
        };
        switch (this.props.conf.type) {
        case SUCCESS:
            snackStyleType = styles.success;
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    done
                </FontIcon>
            );
            break;
        case LOADING:
            snackStyleType = styles.loading;
            icon = <CircularProgress className={styles.icon} color={'#ffffff'} size={28} thickness={2} />;
            break;
        case ERROR:
            snackStyleType = styles.error;
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    error
                </FontIcon>
            );
            break;
        default:
            snackStyleType = styles.warning;
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    warning
                </FontIcon>
            );
            break;
        }
        const snackBarContent = (
            <div className={styles.content}>
                <div>
                    {translator(this.props.conf.message)}
                </div>
                {icon}
            </div>
        );
        return (
            <Snackbar
                open={this.state.show}
                autoHideDuration={this.state.duration}
                message={snackBarContent}
                onRequestClose={this.handleRequestClose}
                bodyStyle={snackBarBodyStyle}
                className={snackStyleType}
            />
        );
    }
}

export default FeedbackSnackbar;
