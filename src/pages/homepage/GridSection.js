import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridTile } from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import { blue500 } from 'material-ui/styles/colors';

class GridSection extends PureComponent {
    static propTypes = {
        setContainer: PropTypes.func.isRequired,
        t: PropTypes.func.isRequired,
        section: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.setContainer(this.props.section.key);
    }

    render() {
        const t = this.props.t;
        return (
            <GridTile key={this.props.section.key} className="grid-element" onClick={this.onClick}>
                <FontIcon className="material-icons grid-icon" color={blue500}>{this.props.section.icon}</FontIcon>
                <div className="grid-description">{t(this.props.section.description)}</div>
                <div className="grid-title">{t(this.props.section.label)}</div>
            </GridTile>
        );
    }
}

export default GridSection;
