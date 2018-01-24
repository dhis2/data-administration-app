import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Page extends PureComponent {
    static propTypes = {
        updateAppState: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        sectionKey: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = props ? { ...props } : {};
    }

    componentWillMount() {
        this.props.updateAppState({
            loading: this.props.hasOwnProperty('loading') ? this.props.loading : true,
            currentSection: this.props.sectionKey,
        });
    }

    componentDidMount() {
        this.props.updateAppState({
            loading: this.props.hasOwnProperty('loading') ? this.props.loading : false,
        });
    }

    /*
    componentWillMount() {
        console.log('COMPONENT WILL MOUNT: ', this.props.currentSection);
    }

    componentDidMount() {
        console.log('COMPONENT DID MOUNT: ', this.props.currentSection);
    }

    componentWillReceiveProps() {
        console.log('COMPONENT WILL RECEIVE PROPS: ', this.props.currentSection);
    }

    componentWillUpdate() {
        console.log('COMPONENT WILL UPDATE: ', this.props.currentSection);
    }

    componentDidUpdate() {
        console.log('COMPONENT DID UPDATE: ', this.props.currentSection);
    }

    componentWillUnmount() {
        console.log('COMPONENT WILL UNMOUNT: ', this.props.currentSection);
    }
    */
}

export default Page;
