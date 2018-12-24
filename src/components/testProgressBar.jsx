import React, { Component } from 'react';
import { Progress } from 'reactstrap';

export class TestProgressBar extends Component {
  render() {
    return(
      <div>
        <div className="text-center">
          {this.props.currentQNo} of {this.props.totalQNo}
        </div>
        <Progress value={this.props.currentQNo - 1} max={this.props.totalQNo} />
      </div>
    );
  }
}