import { Component } from 'react';
import PropTypes from 'prop-types';

class Page extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
        loading: PropTypes.bool,
        currentSection: PropTypes.string,
        pageState: PropTypes.object,
        updateAppState: PropTypes.func,
        t: PropTypes.func,
    }

    constructor(props, context) {
        super(props, context);

        this.state = context && context.pageState ? { ...context.pageState } : {};
        this.state.loading = context && context.hasOwnProperty('loading') ? context.loading : false;
    }

    componentWillMount() {
        if (this.context.currentSection !== this.props.sectionKey) {
            this.context.updateAppState({
                currentSection: this.props.sectionKey,
            });
        }
    }
}

export default Page;

