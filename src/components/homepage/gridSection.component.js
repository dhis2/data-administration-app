import React, { Component } from 'react';

// React i18next
import { translate } from 'react-i18next';

// Material UI
import {GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import {blue500} from 'material-ui/styles/colors';

class GridSectionComponent extends Component {
  onClick() {
    this.props.setContainer(this.props.section.key);
  };

  render() {
    const t = this.props.t;
    return (
      <GridTile key={this.props.section.key} className="grid-element" onClick={this.onClick.bind(this)}>
        <FontIcon className="material-icons grid-icon" color={blue500}>{this.props.section.icon}</FontIcon>
        <div className="grid-description">{t(this.props.section.description)}</div>
        <div className="grid-title">{t(this.props.section.label)}</div>
      </GridTile>
    );
  }
}

export default translate()(GridSectionComponent);
