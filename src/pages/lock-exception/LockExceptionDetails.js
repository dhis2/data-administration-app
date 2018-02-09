import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class LockExceptionDetails extends PureComponent {
    static propTypes = {
        organisationUnitName: PropTypes.string.isRequired,
        dataSetName: PropTypes.string.isRequired,
        periodName: PropTypes.string.isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
    }

    render() {
        const t = this.context.t;
        return (
            <div>
                <h3>{t('Organisation Unit')}</h3>
                <span>{this.props.organisationUnitName}</span>
                <h3>{t('Data Set')}</h3>
                <span>{this.props.dataSetName}</span>
                <h3>{t('Period')}</h3>
                <span>{this.props.periodName}</span>
            </div>
        );
    }
}

export default LockExceptionDetails;
