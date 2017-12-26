import React, { Component } from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';

class HomePageComponent extends Component {
  render() {
    return (
      <div>
        <h1>Homepage</h1>
        <Card>
            <CardText>
              HomePage
            </CardText>
        </Card>
    </div>
    );
  }
}

export default HomePageComponent;
