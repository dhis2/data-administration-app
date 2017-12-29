import React from 'react';
import ReactDOM from 'react-dom';
import DataStatisticsComponent from './dataStatistics.component';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DataStatisticsComponent />, div);
});
