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
        updateAppState: PropTypes.func,
        t: PropTypes.func,
    }

    componentWillMount() {
        // update section on side bar
        if (this.context.currentSection !== this.props.sectionKey) {
            this.context.updateAppState({
                currentSection: this.props.sectionKey,
            });
        }
    }

    // FIXME should it be done at specific component
    componentWillReceiveProps(nextProps) {
        // update state according new props
        this.setState(nextProps);
    }
}

export default Page;

