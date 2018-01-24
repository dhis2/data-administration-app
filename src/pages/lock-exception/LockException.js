import React from 'react';
import PropTypes from 'prop-types';

import Page from '../Page';
import PageContainer from '../PageContainer';

class LockException extends Page {
    static propTypes = {
        t: PropTypes.func.isRequired,
        pageInfo: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.props.updateAppState({
            loading: true,
            currentSection: this.props.sectionKey,
        });
    }

    componentDidMount() {
        this.props.updateAppState({
            loading: false,
        });
    }

    render() {
        return (
            <PageContainer header={this.props.t(this.props.pageInfo.label)}>LockException</PageContainer>
        );
    }
}

export default LockException;
