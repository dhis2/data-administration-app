import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Page extends PureComponent {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
        notifySidebar: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.notifySidebar(this.props.sectionKey);
    }
}

export default Page;
