import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Page extends PureComponent {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
        notifiySidebar: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.notifiySidebar(this.props.sectionKey);
    }
}

export default Page;
