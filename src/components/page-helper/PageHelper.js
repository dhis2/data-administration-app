import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, FontIcon } from 'material-ui';

import styles from './PageHelper.css';

const jsStyles = {
    dialog: {
        maxWidth: '80%',
    },
};

class PageHelper extends PureComponent {
    static propTypes = {
        pageTitle: PropTypes.string.isRequired,
        pageSummary: PropTypes.string.isRequired,
        pageAreas: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            text: PropTypes.string,
        })),
    }

    static defaultProps = {
        pageAreas: [],
    }

    static contextTypes = {
        t: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen() {
        this.setState({ show: true });
    }

    handleClose() {
        this.setState({ show: false });
    }

    render() {
        const translator = this.context.t;
        const actions = [
            <FlatButton
                label={translator('Close')}
                primary={Boolean(true)}
                onClick={this.handleClose}
            />,
        ];

        const pageAreas = this.props.pageAreas.map(area => (
            <span key={area.key} className={styles.areas}>
                <h4>{translator(area.label)}</h4>
                <p>{translator(area.text)}</p>
            </span>
        ));

        return (
            <span className={styles.helper}>
                <FontIcon className="material-icons" onClick={this.handleOpen}>help</FontIcon>
                <Dialog
                    title={translator(this.props.pageTitle)}
                    actions={actions}
                    modal={Boolean(false)}
                    open={this.state.show}
                    autoDetectWindowHeight={Boolean(true)}
                    autoScrollBodyContent={Boolean(true)}
                    contentStyle={jsStyles.dialog}
                    onRequestClose={this.handleClose}
                >
                    <p>{translator(this.props.pageSummary)}</p>
                    {pageAreas}
                </Dialog>
            </span>
        );
    }
}

export default PageHelper;
