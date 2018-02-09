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
        this.pageMounted = true;

        // update section on side bar
        if (this.context.currentSection !== this.props.sectionKey) {
            this.context.updateAppState({
                currentSection: this.props.sectionKey,
            });
        }
    }

    // This is the default behavior. However, it is recommended to override this method on each Page Component
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    componentWillUnmount() {
        this.pageMounted = false;
    }

    isPageMounted() {
        return this.pageMounted;
    }
}

export default Page;

