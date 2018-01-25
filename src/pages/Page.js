import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Page extends PureComponent {
    static propTypes = {
        updateAppState: PropTypes.func.isRequired,
        sectionKey: PropTypes.string.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
        loading: PropTypes.bool,
        currentSection: PropTypes.string,
        pageState: PropTypes.object,
    }

    constructor(props, context) {
        super(props, context);

        this.state = context && context.pageState ? { ...context.pageState } : {};
        this.state.loading = context && context.hasOwnProperty('loading') ? context.loading : false;
    }

    componentWillMount() {
        // console.log('COMPONENT WILL MOUNT: ', this.props.sectionKey);
        // console.log('CURRENT SECTION: ', this.context.currentSection);
        this.props.updateAppState({
            currentSection: this.props.sectionKey,
        });
    }
    /*
    componentDidMount() {
        console.log('COMPONENT DID MOUNT: ', this.props.sectionKey);
    }

    componentWillReceiveProps() {
        console.log('COMPONENT WILL RECEIVE PROPS: ', this.props.sectionKey);
    }

    componentWillUpdate() {
        console.log('COMPONENT WILL UPDATE: ', this.props.sectionKey);
    }

    componentDidUpdate() {
        console.log('COMPONENT DID UPDATE: ', this.props.sectionKey);
    }

    componentWillUnmount() {
        console.log('COMPONENT WILL UNMOUNT: ', this.props.sectionKey);
        console.log('CURRENT SECTION: ', this.context.currentSection);
    }
    */
}

export default Page;

