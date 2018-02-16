import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class LockExceptionDetails extends PureComponent {
    static propTypes = {
        organisationUnitName: PropTypes.string.isRequired,
        dataSetName: PropTypes.string.isRequired,
        periodName: PropTypes.string.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
    }

    render() {
        const translator = this.context.translator;
        return (
            <div>
                <h3>{translator('Organisation Unit')}</h3>
                <span>{this.props.organisationUnitName}</span>
                <h3>{translator('Data Set')}</h3>
                <span>{this.props.dataSetName}</span>
                <h3>{translator('Period')}</h3>
                <span>{this.props.periodName}</span>
            </div>
        );
    }
}

export default LockExceptionDetails;
