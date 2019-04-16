import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'material-ui';
import i18n from '../../locales';
import { getDocsVersion, DOCS_LINK, DOCS_TOOLTIP_LABEL } from '../../helpers/docs';

class PageHelper extends PureComponent {
    static propTypes = {
        lng: PropTypes.string,
        sectionDocsKey: PropTypes.string.isRequired,
    };

    static defaultProps = {
        lng: 'en',
    };

    static contextTypes = {
        d2: PropTypes.object,
    };

    render() {
        const { d2 } = this.context;
        const { lng, sectionDocsKey } = this.props;
        return (
            <IconButton
                className="helper-icon"
                iconStyle={{ color: '#276696' }}
                href={`${DOCS_LINK}/${getDocsVersion(d2.system.version)}/${lng}/user/html/${sectionDocsKey}.html`}
                target="_blank"
                rel="noopener noreferrer"
                tooltip={i18n.t(DOCS_TOOLTIP_LABEL)}
                tooltipPosition="bottom-center"
                iconClassName="material-icons"
            >
                help
            </IconButton>
        );
    }
}

export default PageHelper;
