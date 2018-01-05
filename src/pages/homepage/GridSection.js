import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI
import { GridTile } from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import { blue500 } from 'material-ui/styles/colors';

class GridSection extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        section: PropTypes.object.isRequired,
    }

    render() {
        const t = this.props.t;
        return (
            <Link to={this.props.section.path}>
                <GridTile key={this.props.section.key} className="grid-element">
                    <FontIcon className="material-icons grid-icon" color={blue500}>{this.props.section.icon}</FontIcon>
                    <div className="grid-description">{t(this.props.section.description)}</div>
                    <div className="grid-title">{t(this.props.section.label)}</div>
                </GridTile>
            </Link>
        );
    }
}

export default GridSection;
