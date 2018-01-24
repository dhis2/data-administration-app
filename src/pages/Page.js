import { PureComponent } from 'react';
// import PropTypes from 'prop-types';

class Page extends PureComponent {
    /*
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }
    */
    constructor(props) {
        super(props);

        this.state = { ...props };
    }
    /*
    componentWillMount() {
        console.log('COMPONENT WILL MOUNT: ', this.props.sectionKey);
    }

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
    }
    */
}

export default Page;
