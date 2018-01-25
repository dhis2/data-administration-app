import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Page extends PureComponent {
    static propTypes = {
        updateAppState: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        sectionKey: PropTypes.string.isRequired,
        pageState: PropTypes.object.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.state = props && props.pageState ? { ...props.pageState } : {};
        this.state.loading = props && props.hasOwnProperty('loading') ? props.loading : false;
    }

    componentWillMount() {
        // console.log('COMPONENT WILL MOUNT: ', this.props.sectionKey);
        this.props.updateAppState({
            loading: this.props.hasOwnProperty('loading') ? this.props.loading : true,
            currentSection: this.props.sectionKey,
        });
    }

    componentDidMount() {
        // console.log('COMPONENT DID MOUNT: ', this.props.sectionKey);
        this.props.updateAppState({
            loading: this.props.hasOwnProperty('loading') ? this.props.loading : false,
        });
    }
    /*
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
    }
    */
}

export default Page;
