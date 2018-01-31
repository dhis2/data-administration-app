import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, Snackbar } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import classNames from 'classnames';

import styles from './FeedbackSnackbar.css';

class FeedbackSnackbar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
        snackbarConf: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.show,
        };
    }

    handleRequestClose = () => {
    }

    render() {
        if (!this.props.show) {
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
        switch (this.context.snackbarConf.type) {
        case 'SUCCESS':
            snackStyleType = styles.success;
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    done
                </FontIcon>
            );
            break;
        case 'LOADING':
            snackStyleType = styles.loading;
            icon = <CircularProgress className={styles.icon} color={'#ffffff'} size={28} thickness={2} />;
            break;
        case 'ERROR':
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
                    {translator(this.context.snackbarConf.message)}
                </div>
                {icon}
            </div>
        );
        return (
            <Snackbar
                open={this.props.show}
                message={snackBarContent}
                onRequestClose={this.handleRequestClose}
                bodyStyle={snackBarBodyStyle}
                className={snackStyleType}
            />
        );
    }
}

export default FeedbackSnackbar;
