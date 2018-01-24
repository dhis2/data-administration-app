import { PureComponent } from 'react';
// import PropTypes from 'prop-types';

class Page extends PureComponent {
    /*
    static propTypes = {
        currentSection: PropTypes.string.isRequired,
    }
    */
    constructor(props) {
        super(props);

        this.state = { ...props };
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
