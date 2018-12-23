import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export class LandingPage extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center flex-column landing-page">
        <div className="text-center rounded p-4">
          <p className="h1 text-monospace text-uppercase">
            Test yourself endlessly with computer generated problems, for free!
          </p>
          <div className="text-center">
            <Button tag={Link} to="/test" size="lg" color="primary">Let's go</Button>
          </div>
        </div>
      </div>
    );
  }
}